package tester

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestVersionMatching(t *testing.T) {
	tests := []struct {
		name       string
		constraint string
		version    string
		matches    bool
	}{
		{name: "gte match", constraint: ">= 2.0", version: "2.17.0", matches: true},
		{name: "gte no match", constraint: ">= 2.17", version: "2.0.0", matches: false},
		{name: "lt match", constraint: "< 3.0", version: "2.17.0", matches: true},
		{name: "lt no match", constraint: "< 2.0", version: "2.17.0", matches: false},
		{name: "range match", constraint: ">= 2.0, < 3.0", version: "2.17.0", matches: true},
		{name: "range no match", constraint: ">= 2.0, < 2.5", version: "2.17.0", matches: false},
		{name: "exact match", constraint: ">= 2.17", version: "2.17.0", matches: true},
		{name: "space-separated range match", constraint: ">= 2.4 < 2.19", version: "2.17.0", matches: true},
		{name: "space-separated range no match", constraint: ">= 2.4 < 2.19", version: "2.19.0", matches: false},
		{name: "space-separated range below", constraint: ">= 2.4 < 2.19", version: "2.3.0", matches: false},
		{name: "prerelease stripped", constraint: ">= 2.0", version: "2.17.0-SNAPSHOT", matches: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := matchesVersion(tt.constraint, tt.version)
			require.Equal(t, tt.matches, result)
		})
	}
}

func TestShouldSkip(t *testing.T) {
	t.Run("version skip", func(t *testing.T) {
		skip, _ := shouldSkip(">= 3.0", nil, "2.17.0", "")
		require.True(t, skip)
	})

	t.Run("version pass", func(t *testing.T) {
		skip, _ := shouldSkip(">= 2.0", nil, "2.17.0", "")
		require.False(t, skip)
	})

	t.Run("distribution excluded", func(t *testing.T) {
		dist := &Distributions{Excluded: []string{"amazon-serverless"}}
		skip, _ := shouldSkip("", dist, "2.17.0", "amazon-serverless")
		require.True(t, skip)
	})

	t.Run("distribution not included", func(t *testing.T) {
		dist := &Distributions{Included: []string{"opensearch.org"}}
		skip, _ := shouldSkip("", dist, "2.17.0", "amazon-managed")
		require.True(t, skip)
	})

	t.Run("distribution included", func(t *testing.T) {
		dist := &Distributions{Included: []string{"opensearch.org"}}
		skip, _ := shouldSkip("", dist, "2.17.0", "opensearch.org")
		require.False(t, skip)
	})
}

func TestComparePayload(t *testing.T) {
	tests := []struct {
		name     string
		expected any
		actual   any
		wantErr  bool
	}{
		{
			name:     "matching objects",
			expected: map[string]any{"acknowledged": true},
			actual:   map[string]any{"acknowledged": true, "extra": "allowed"},
			wantErr:  false,
		},
		{
			name:     "missing field",
			expected: map[string]any{"acknowledged": true},
			actual:   map[string]any{"other": true},
			wantErr:  true,
		},
		{
			name:     "wrong value",
			expected: map[string]any{"status": float64(200)},
			actual:   map[string]any{"status": float64(404)},
			wantErr:  true,
		},
		{
			name:     "nested match",
			expected: map[string]any{"data": map[string]any{"id": "abc"}},
			actual:   map[string]any{"data": map[string]any{"id": "abc", "extra": true}},
			wantErr:  false,
		},
		{
			name:     "array match",
			expected: []any{map[string]any{"id": float64(1)}},
			actual:   []any{map[string]any{"id": float64(1)}},
			wantErr:  false,
		},
		{
			name:     "array length mismatch",
			expected: []any{float64(1), float64(2)},
			actual:   []any{float64(1)},
			wantErr:  true,
		},
		{
			name:     "array subset match",
			expected: []any{float64(1)},
			actual:   []any{float64(1), float64(2), float64(3)},
			wantErr:  false,
		},
		{
			name:     "numeric coercion",
			expected: map[string]any{"count": 5},
			actual:   map[string]any{"count": float64(5)},
			wantErr:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := comparePayload(tt.expected, tt.actual)
			if tt.wantErr {
				require.Error(t, err)
			} else {
				require.NoError(t, err)
			}
		})
	}
}

func TestExpandChapters(t *testing.T) {
	chapters := []Chapter{
		{Synopsis: "Single method.", Method: StringOrList{"GET"}, Path: "/test"},
		{Synopsis: "Multi method.", Method: StringOrList{"GET", "POST"}, Path: "/test"},
	}

	expanded := expandChapters(chapters)
	require.Len(t, expanded, 3)
	require.Equal(t, "Single method.", expanded[0].Synopsis)
	require.Equal(t, StringOrList{"GET"}, expanded[0].Method)
	require.Equal(t, "Multi method. [GET]", expanded[1].Synopsis)
	require.Equal(t, StringOrList{"GET"}, expanded[1].Method)
	require.Equal(t, "Multi method. [POST]", expanded[2].Synopsis)
	require.Equal(t, StringOrList{"POST"}, expanded[2].Method)
}

func TestOutputsResolveMapKeys(t *testing.T) {
	o := NewOutputs()
	o.Set("node", "id", "abc123")

	input := map[string]any{
		"nodes": map[string]any{
			"${node.id}": map[string]any{
				"name": "test-node",
			},
		},
	}

	resolved, err := o.Resolve(input)
	require.NoError(t, err)

	m := resolved.(map[string]any)
	nodes := m["nodes"].(map[string]any)
	require.Contains(t, nodes, "abc123")
	require.NotContains(t, nodes, "${node.id}")
}

func TestExtractOutputArrayIndex(t *testing.T) {
	payload := map[string]any{
		"nodes": []any{
			map[string]any{"id": "node-abc", "name": "first"},
			map[string]any{"id": "node-def", "name": "second"},
		},
	}
	headers := map[string]string{}

	tests := []struct {
		name   string
		path   string
		expect any
	}{
		{"payload[0] via bracket path", "payload.nodes[0].id", "node-abc"},
		{"payload[1] via bracket path", "payload.nodes[1].name", "second"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			outputDef := map[string]any{"val": tt.path}
			result, err := ExtractOutput(outputDef, payload, headers)
			require.NoError(t, err)
			require.Equal(t, tt.expect, result["val"])
		})
	}
}
