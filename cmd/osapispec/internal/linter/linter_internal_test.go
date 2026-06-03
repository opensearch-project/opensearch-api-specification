package linter

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestLintSchemaFileName(t *testing.T) {
	tests := []struct {
		name    string
		file    string
		wantErr bool
	}{
		{name: "valid two-part name", file: "cluster.health.yaml", wantErr: false},
		{name: "valid common", file: "_common.yaml", wantErr: false},
		{name: "invalid uppercase", file: "Cluster.Health.yaml", wantErr: true},
		{name: "invalid single word", file: "cluster.yaml", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			dir := setupFixture(t, "schemas", tt.file, `
components:
  schemas:
    Foo:
      type: object
`)
			l, err := NewLinter(dir)
			require.NoError(t, err)
			errors := l.lintSchemaFiles()

			if tt.wantErr {
				require.NotEmpty(t, errors, "expected lint error for %s", tt.file)
			} else {
				require.Empty(t, errors, "unexpected lint error for %s: %v", tt.file, errors)
			}
		})
	}
}

func TestLintSchemaName(t *testing.T) {
	tests := []struct {
		name       string
		schemaName string
		wantErr    bool
	}{
		{name: "PascalCase", schemaName: "SearchRequest", wantErr: false},
		{name: "with digits", schemaName: "V2Response", wantErr: false},
		{name: "has underscore", schemaName: "Search_Request", wantErr: true},
		{name: "has dash", schemaName: "Search-Request", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			dir := setupFixture(t, "schemas", "_common.yaml", `
components:
  schemas:
    `+tt.schemaName+`:
      type: object
`)
			l, err := NewLinter(dir)
			require.NoError(t, err)
			errors := l.lintSchemaFiles()

			if tt.wantErr {
				require.NotEmpty(t, errors)
			} else {
				require.Empty(t, errors)
			}
		})
	}
}

func TestLintNamespaceName(t *testing.T) {
	tests := []struct {
		name    string
		file    string
		wantErr bool
	}{
		{name: "valid", file: "cluster.yaml", wantErr: false},
		{name: "valid core", file: "_core.yaml", wantErr: false},
		{name: "valid multi-word", file: "asynchronous_search.yaml", wantErr: false},
		{name: "invalid uppercase", file: "Cluster.yaml", wantErr: true},
		{name: "invalid single char", file: "a.yaml", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ns := tt.file[:len(tt.file)-len(".yaml")]
			group := ns + ".get"
			if ns == "_core" {
				group = "search"
			}
			content := `
paths:
  /_test:
    get:
      x-operation-group: ` + group + `
      operationId: ` + group + `.0
      description: Test endpoint.
      parameters: []
`
			dir := setupFixture(t, "namespaces", tt.file, content)
			l, err := NewLinter(dir)
			require.NoError(t, err)
			errors := l.lintNamespaceFiles()

			if tt.wantErr {
				require.NotEmpty(t, errors, "expected lint error for %s", tt.file)
			} else {
				require.Empty(t, errors, "unexpected lint error for %s: %v", tt.file, errors)
			}
		})
	}
}

func TestLintOperationGroup(t *testing.T) {
	tests := []struct {
		name    string
		group   string
		ns      string
		wantErr bool
	}{
		{name: "valid namespaced", group: "cluster.health", ns: "cluster", wantErr: false},
		{name: "valid core", group: "search", ns: "_core", wantErr: false},
		{name: "namespace mismatch", group: "indices.create", ns: "cluster", wantErr: true},
		{name: "invalid pattern", group: "Cluster.Health", ns: "cluster", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			content := `
paths:
  /_test:
    get:
      x-operation-group: ` + tt.group + `
      operationId: ` + tt.group + `.0
      description: Test endpoint.
      parameters: []
`
			dir := setupFixture(t, "namespaces", tt.ns+".yaml", content)
			l, err := NewLinter(dir)
			require.NoError(t, err)
			errors := l.lintNamespaceFiles()

			hasGroupErr := false
			for _, e := range errors {
				if strings.Contains(e.Message, "x-operation-group") {
					hasGroupErr = true
				}
			}
			if tt.wantErr {
				require.True(t, hasGroupErr, "expected operation-group error, got: %v", errors)
			} else {
				require.False(t, hasGroupErr, "unexpected operation-group error: %v", errors)
			}
		})
	}
}

func TestLintDescription(t *testing.T) {
	tests := []struct {
		name    string
		desc    string
		wantErr bool
	}{
		{name: "valid", desc: "Searches the index.", wantErr: false},
		{name: "no trailing period", desc: "Searches the index", wantErr: true},
		{name: "lowercase start", desc: "searches the index.", wantErr: true},
		{name: "empty", desc: "", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			descLine := ""
			if tt.desc != "" {
				descLine = "      description: " + tt.desc
			}
			content := `
paths:
  /_test:
    get:
      x-operation-group: test.get
      operationId: test.get.0
` + descLine + `
      parameters: []
`
			dir := setupFixture(t, "namespaces", "_core.yaml", content)
			l, err := NewLinter(dir)
			require.NoError(t, err)
			errors := l.lintNamespaceFiles()

			hasDescErr := false
			for _, e := range errors {
				if strings.Contains(e.Message, "description") {
					hasDescErr = true
				}
			}
			if tt.wantErr {
				require.True(t, hasDescErr, "expected description error, got: %v", errors)
			} else {
				require.False(t, hasDescErr, "unexpected description error: %v", errors)
			}
		})
	}
}

func TestLintSchemaFormats(t *testing.T) {
	tests := []struct {
		name    string
		schema  string
		wantErr bool
	}{
		{
			name:    "valid integer/int32",
			schema:  "type: integer\n      format: int32",
			wantErr: false,
		},
		{
			name:    "valid number/float",
			schema:  "type: number\n      format: float",
			wantErr: false,
		},
		{
			name:    "number with int32 format",
			schema:  "type: number\n      format: int32",
			wantErr: true,
		},
		{
			name:    "integer with float format",
			schema:  "type: integer\n      format: float",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			content := `
components:
  schemas:
    Test:
      ` + tt.schema + `
`
			dir := setupFixture(t, "schemas", "_common.yaml", content)
			l, err := NewLinter(dir)
			require.NoError(t, err)
			errors := l.lintSchemaFiles()

			if tt.wantErr {
				require.NotEmpty(t, errors)
			} else {
				require.Empty(t, errors)
			}
		})
	}
}

func setupFixture(t *testing.T, subdir, filename, content string) string {
	t.Helper()
	dir := t.TempDir()
	sub := filepath.Join(dir, subdir)
	require.NoError(t, os.MkdirAll(sub, 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(sub, filename), []byte(content), 0o600))

	if subdir == "schemas" {
		require.NoError(t, os.MkdirAll(filepath.Join(dir, "namespaces"), 0o755))
	} else {
		require.NoError(t, os.MkdirAll(filepath.Join(dir, "schemas"), 0o755))
	}
	return dir
}
