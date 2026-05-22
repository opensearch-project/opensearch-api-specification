package merger_test

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
	"gopkg.in/yaml.v3"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/merger"
	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/spec"
)

func TestMergeIntegration(t *testing.T) {
	specRoot := findSpecRoot(t)

	m, err := merger.NewMerger(specRoot)
	require.NoError(t, err)

	result, err := m.Merge()
	require.NoError(t, err)

	paths := spec.GetPath(result, spec.KeyPaths)
	require.NotNil(t, paths)

	var pathCount int
	spec.ForEachKV(paths, func(_ string, _ *yaml.Node) { pathCount++ })
	require.Greater(t, pathCount, 100, "expected at least 100 paths")

	schemas := spec.GetPath(result, spec.KeyComponents, spec.KeySchemas)
	require.NotNil(t, schemas)

	var schemaCount int
	spec.ForEachKV(schemas, func(_ string, _ *yaml.Node) { schemaCount++ })
	require.Greater(t, schemaCount, 1000, "expected at least 1000 schemas")
}

func TestMergeOutputParity(t *testing.T) {
	specRoot := findSpecRoot(t)
	goldenPath := filepath.Join(filepath.Dir(specRoot), "build", "go-opensearch-openapi.yaml")

	if _, err := os.Stat(goldenPath); err != nil {
		t.Skipf("golden file not found: %s", goldenPath)
	}

	m, err := merger.NewMerger(specRoot)
	require.NoError(t, err)

	result, err := m.Merge()
	require.NoError(t, err)

	tmpFile := filepath.Join(t.TempDir(), "output.yaml")
	require.NoError(t, merger.WriteYAML(tmpFile, result))

	got, err := os.ReadFile(tmpFile)
	require.NoError(t, err)
	want, err := os.ReadFile(goldenPath)
	require.NoError(t, err)

	if string(got) != string(want) { //nolint:nestif // straightforward diff reporting
		gotLines := strings.Split(string(got), "\n")
		wantLines := strings.Split(string(want), "\n")
		diffs := 0
		for i := range min(len(gotLines), len(wantLines)) {
			if gotLines[i] != wantLines[i] {
				if diffs < 5 {
					t.Errorf("line %d:\n  got:  %s\n  want: %s", i+1, gotLines[i], wantLines[i])
				}
				diffs++
			}
		}
		if len(gotLines) != len(wantLines) {
			t.Errorf("line count: got %d, want %d", len(gotLines), len(wantLines))
		}
		if diffs > 5 {
			t.Errorf("... and %d more differences", diffs-5)
		}
	}
}

func findSpecRoot(t *testing.T) string {
	t.Helper()
	dir, _ := os.Getwd()
	for range 10 {
		candidate := filepath.Join(dir, "spec")
		if info, err := os.Stat(candidate); err == nil && info.IsDir() {
			if _, err := os.Stat(filepath.Join(candidate, "_info.yaml")); err == nil {
				return candidate
			}
		}
		dir = filepath.Dir(dir)
	}
	t.Skip("spec directory not found")
	return ""
}
