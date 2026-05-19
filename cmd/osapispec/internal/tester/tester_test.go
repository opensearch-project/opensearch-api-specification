package tester_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	"gopkg.in/yaml.v3"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/tester"
)

func TestStringOrList(t *testing.T) {
	tests := []struct {
		name   string
		input  string
		expect []string
	}{
		{name: "single string", input: "GET", expect: []string{"GET"}},
		{name: "list", input: "[GET, POST]", expect: []string{"GET", "POST"}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var s tester.StringOrList
			require.NoError(t, yaml.Unmarshal([]byte(tt.input), &s))
			require.Equal(t, tt.expect, []string(s))
		})
	}
}

func TestIntOrList(t *testing.T) {
	tests := []struct {
		name   string
		input  string
		expect []int
	}{
		{name: "single int", input: "200", expect: []int{200}},
		{name: "list", input: "[200, 404]", expect: []int{200, 404}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var i tester.IntOrList
			require.NoError(t, yaml.Unmarshal([]byte(tt.input), &i))
			require.Equal(t, tt.expect, []int(i))
		})
	}
}

func TestParseStory(t *testing.T) {
	input := `
$schema: test.schema.yaml
description: Test bulk endpoint.
version: '>= 2.0'
epilogues:
  - path: /books
    method: DELETE
    status: [200, 404]
chapters:
  - synopsis: Create docs.
    path: /_bulk
    method: POST
    request:
      content_type: application/x-ndjson
      payload:
        - {create: {_index: movies}}
        - {title: Moneyball}
    response:
      status: 200
`
	var story tester.Story
	require.NoError(t, yaml.Unmarshal([]byte(input), &story))
	require.Equal(t, "Test bulk endpoint.", story.Description)
	require.Equal(t, ">= 2.0", story.Version)
	require.Len(t, story.Epilogues, 1)
	require.Equal(t, "/books", story.Epilogues[0].Path)
	require.Equal(t, []int{200, 404}, story.Epilogues[0].Status)
	require.Len(t, story.Chapters, 1)
	require.Equal(t, "Create docs.", story.Chapters[0].Synopsis)
	require.Equal(t, "application/x-ndjson", story.Chapters[0].Request.ContentType)
}

func TestOutputs(t *testing.T) {
	o := tester.NewOutputs()
	o.Set("create_index", "name", "books")
	o.Set("create_index", "id", 42)

	t.Run("resolve direct reference", func(t *testing.T) {
		val, err := o.Resolve("${create_index.name}")
		require.NoError(t, err)
		require.Equal(t, "books", val)
	})

	t.Run("resolve typed reference", func(t *testing.T) {
		val, err := o.Resolve("${create_index.id}")
		require.NoError(t, err)
		require.Equal(t, 42, val)
	})

	t.Run("resolve interpolation", func(t *testing.T) {
		val, err := o.Resolve("index-${create_index.name}-v2")
		require.NoError(t, err)
		require.Equal(t, "index-books-v2", val)
	})

	t.Run("resolve in map", func(t *testing.T) {
		input := map[string]any{"index": "${create_index.name}"}
		val, err := o.Resolve(input)
		require.NoError(t, err)
		require.Equal(t, map[string]any{"index": "books"}, val)
	})

	t.Run("unresolved reference", func(t *testing.T) {
		_, err := o.Resolve("${missing.field}")
		require.Error(t, err)
		require.Contains(t, err.Error(), "unresolved output reference")
	})
}

func TestExtractOutput(t *testing.T) {
	payload := map[string]any{
		"model_id": "abc-123",
		"data": map[string]any{
			"nested": "value",
		},
	}
	headers := map[string]string{
		"x-request-id": "req-456",
	}

	tests := []struct {
		name   string
		def    map[string]any
		expect map[string]any
	}{
		{
			name:   "payload field",
			def:    map[string]any{"id": "payload.model_id"},
			expect: map[string]any{"id": "abc-123"},
		},
		{
			name:   "nested payload",
			def:    map[string]any{"val": "payload.data.nested"},
			expect: map[string]any{"val": "value"},
		},
		{
			name:   "header",
			def:    map[string]any{"reqid": "headers.x-request-id"},
			expect: map[string]any{"reqid": "req-456"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := tester.ExtractOutput(tt.def, payload, headers)
			require.NoError(t, err)
			require.Equal(t, tt.expect, result)
		})
	}
}
