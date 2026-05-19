package merger

import (
	"testing"

	"github.com/stretchr/testify/require"
	"gopkg.in/yaml.v3"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/spec"
)

func parseYAML(t *testing.T, s string) *yaml.Node {
	t.Helper()
	var doc yaml.Node
	require.NoError(t, yaml.Unmarshal([]byte(s), &doc))
	return &doc
}

func TestRedirectRefsInSchema(t *testing.T) {
	tests := []struct {
		name     string
		ref      string
		category string
		want     string
	}{
		{
			name:     "local schema ref",
			ref:      "#/components/schemas/Bar",
			category: "mycat",
			want:     "#/components/schemas/mycat:Bar",
		},
		{
			name:     "external schema ref",
			ref:      "other.yaml#/components/schemas/Baz",
			category: "mycat",
			want:     "#/components/schemas/other:Baz",
		},
		{
			name:     "non-schema ref unchanged",
			ref:      "#/components/parameters/foo",
			category: "mycat",
			want:     "#/components/parameters/foo",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			doc := parseYAML(t, "$ref: '"+tt.ref+"'")
			redirectRefsInSchema(doc.Content[0], tt.category)
			got := spec.GetRefValue(doc.Content[0])
			require.Equal(t, tt.want, got)
		})
	}
}

func TestRedirectRefsInNamespace(t *testing.T) {
	tests := []struct {
		name string
		ref  string
		want string
	}{
		{
			name: "schema ref rewritten",
			ref:  "../schemas/_common.yaml#/components/schemas/SearchRequest",
			want: "#/components/schemas/_common:SearchRequest",
		},
		{
			name: "non-schema ref unchanged",
			ref:  "#/components/parameters/index",
			want: "#/components/parameters/index",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			doc := parseYAML(t, "$ref: '"+tt.ref+"'")
			redirectRefsInNamespace(doc)
			got := spec.GetRefValue(doc.Content[0])
			require.Equal(t, tt.want, got)
		})
	}
}

func TestSortMappingKeys(t *testing.T) {
	tests := []struct {
		name      string
		keys      string
		wantFirst string
	}{
		{
			name:      "alphabetical",
			keys:      "z_path: {}\na_path: {}\nm_path: {}",
			wantFirst: "a_path",
		},
		{
			name:      "braces sort before letters via collation",
			keys:      "/_cat/indices:\n  get: {}\n/_cat/indices/{index}:\n  get: {}\n/_cat/health:\n  get: {}",
			wantFirst: "/_cat/health",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			doc := parseYAML(t, tt.keys)
			node := doc.Content[0]
			sortMappingKeys(node)

			firstKey := node.Content[0].Value
			require.Equal(t, tt.wantFirst, firstKey)
		})
	}
}

func TestNormalizeFields(t *testing.T) {
	tests := []struct {
		name string
		key  string
		want string
	}{
		{name: "double colon", key: "_global::query.pretty", want: "_global___query.pretty"},
		{name: "at sign", key: "cat@bytes", want: "cat___bytes"},
		{name: "single colon", key: "schema:key", want: "schema___key"},
		{name: "no special chars", key: "normal_key", want: "normal_key"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			doc := parseYAML(t, tt.key+": value")
			normalizeFields(doc)
			firstKey := doc.Content[0].Content[0].Value
			require.Equal(t, tt.want, firstKey)
		})
	}
}

func TestNormalizeFieldsRefs(t *testing.T) {
	doc := parseYAML(t, `$ref: '#/components/parameters/_global::query.pretty'`)
	normalizeFields(doc)
	ref := spec.ScalarValue(doc.Content[0].Content[1])
	require.Equal(t, "#/components/parameters/_global___query.pretty", ref)
}

func TestVersionExtraction(t *testing.T) {
	tests := []struct {
		name        string
		version     string
		wantPaths   []string
		absentPaths []string
	}{
		{
			name:        "excludes future additions",
			version:     "2.4.0",
			wantPaths:   []string{"/old"},
			absentPaths: []string{"/new", "/removed"},
		},
		{
			name:        "includes when version matches",
			version:     "2.5.0",
			wantPaths:   []string{"/old", "/new"},
			absentPaths: []string{"/removed"},
		},
	}

	yamlDoc := `
openapi: '3.1.0'
info:
  title: Test
  version: '1.0.0'
paths:
  /new:
    get:
      x-version-added: '2.5.0'
      description: New endpoint.
  /old:
    get:
      description: Old endpoint.
  /removed:
    get:
      x-version-removed: '2.0.0'
      description: Removed endpoint.
components:
  schemas: {}
  parameters: {}
  requestBodies: {}
  responses: {}
`

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			doc := parseYAML(t, yamlDoc)
			result, err := ExtractVersion(doc, tt.version)
			require.NoError(t, err)

			paths := spec.GetPath(result, spec.KeyPaths)
			for _, p := range tt.wantPaths {
				require.NotNilf(t, spec.GetMappingValue(paths, p), "expected path %s present", p)
			}
			for _, p := range tt.absentPaths {
				require.Nilf(t, spec.GetMappingValue(paths, p), "expected path %s absent", p)
			}
		})
	}
}
