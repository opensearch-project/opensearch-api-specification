package spec_test

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

func TestGetPath(t *testing.T) {
	tests := []struct {
		name    string
		yaml    string
		path    []string
		wantNil bool
	}{
		{
			name: "nested key exists",
			yaml: "components:\n  schemas:\n    Foo:\n      type: object",
			path: []string{"components", "schemas", "Foo"},
		},
		{
			name:    "missing intermediate key",
			yaml:    "components:\n  schemas: {}",
			path:    []string{"components", "parameters"},
			wantNil: true,
		},
		{
			name:    "missing leaf key",
			yaml:    "components:\n  schemas:\n    Foo: {}",
			path:    []string{"components", "schemas", "Bar"},
			wantNil: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			doc := parseYAML(t, tt.yaml)
			node := spec.GetPath(doc, tt.path...)
			if tt.wantNil {
				require.Nil(t, node)
			} else {
				require.NotNil(t, node)
			}
		})
	}
}

func TestGetMappingValue(t *testing.T) {
	tests := []struct {
		name string
		yaml string
		key  string
		want string
	}{
		{name: "existing key", yaml: "foo: bar\nbaz: 42", key: "foo", want: "bar"},
		{name: "missing key", yaml: "foo: bar", key: "missing", want: ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			doc := parseYAML(t, tt.yaml)
			val := spec.ScalarValue(spec.GetMappingValue(doc.Content[0], tt.key))
			require.Equal(t, tt.want, val)
		})
	}
}

func TestForEachKV(t *testing.T) {
	doc := parseYAML(t, "a: 1\nb: 2\nc: 3")
	var keys []string
	spec.ForEachKV(doc.Content[0], func(key string, _ *yaml.Node) {
		keys = append(keys, key)
	})
	require.Equal(t, []string{"a", "b", "c"}, keys)
}

func TestGetRefValue(t *testing.T) {
	tests := []struct {
		name string
		yaml string
		want string
	}{
		{
			name: "has ref",
			yaml: "$ref: '#/components/schemas/Foo'",
			want: "#/components/schemas/Foo",
		},
		{
			name: "no ref",
			yaml: "type: object",
			want: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			doc := parseYAML(t, tt.yaml)
			require.Equal(t, tt.want, spec.GetRefValue(doc.Content[0]))
		})
	}
}

func TestWalkRefs(t *testing.T) {
	doc := parseYAML(t, `
properties:
  name:
    $ref: '../schemas/common.yaml#/components/schemas/Name'
  nested:
    items:
      $ref: '#/components/schemas/Item'
`)
	var refs []string
	spec.WalkRefs(doc, func(ref string) string {
		refs = append(refs, ref)
		return ref
	})
	require.Equal(t, []string{
		"../schemas/common.yaml#/components/schemas/Name",
		"#/components/schemas/Item",
	}, refs)
}

func TestWalkRefsRewrite(t *testing.T) {
	doc := parseYAML(t, "$ref: 'old'")
	spec.WalkRefs(doc, func(_ string) string {
		return "new"
	})
	ref := spec.GetRefValue(doc.Content[0])
	require.Equal(t, "new", ref)
}

func TestDeepCopy(t *testing.T) {
	doc := parseYAML(t, "foo:\n  bar: baz")
	cp := spec.DeepCopy(doc)

	cp.Content[0].Content[1].Content[0].Value = "modified"

	original := spec.ScalarValue(spec.GetPath(doc, "foo", "bar"))
	require.Equal(t, "baz", original)
}

func TestSetMappingValue(t *testing.T) {
	tests := []struct {
		name     string
		yaml     string
		key      string
		value    string
		wantKeys []string
	}{
		{
			name:     "update existing",
			yaml:     "foo: bar",
			key:      "foo",
			value:    "updated",
			wantKeys: []string{"foo"},
		},
		{
			name:     "add new",
			yaml:     "foo: bar",
			key:      "new",
			value:    "added",
			wantKeys: []string{"foo", "new"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			doc := parseYAML(t, tt.yaml)
			root := doc.Content[0]
			spec.SetMappingValue(root, tt.key, spec.ScalarNode(tt.value))

			val := spec.ScalarValue(spec.GetMappingValue(root, tt.key))
			require.Equal(t, tt.value, val)

			var keys []string
			spec.ForEachKV(root, func(k string, _ *yaml.Node) { keys = append(keys, k) })
			require.Equal(t, tt.wantKeys, keys)
		})
	}
}
