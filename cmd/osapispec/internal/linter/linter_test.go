package linter_test

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/linter"
)

func TestLintValidSpec(t *testing.T) {
	specRoot := findSpecRoot(t)
	l, err := linter.NewLinter(specRoot)
	require.NoError(t, err)

	errors := l.Lint()
	require.Empty(t, errors, "expected no lint errors on valid spec")
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
