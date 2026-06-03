// Package spec provides shared constants and YAML helper functions used across
// the osapispec tool's internal packages.
package spec

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

const (
	// OpenAPIVersion is the OpenAPI specification version used by this project.
	OpenAPIVersion = "3.1.0"

	// KeyOpenAPI is the top-level "openapi" field key.
	KeyOpenAPI = "openapi"
	// KeyInfo is the top-level "info" field key.
	KeyInfo = "info"
	// KeyPaths is the top-level "paths" field key.
	KeyPaths = "paths"
	// KeyComponents is the top-level "components" field key.
	KeyComponents = "components"

	// KeySchemas is the "schemas" key within components.
	KeySchemas = "schemas"
	// KeyParameters is the "parameters" key within components.
	KeyParameters = "parameters"
	// KeyRequestBodies is the "requestBodies" key within components.
	KeyRequestBodies = "requestBodies"
	// KeyResponses is the "responses" key within components.
	KeyResponses = "responses"

	// KeyRef is the JSON Reference "$ref" field key.
	KeyRef = "$ref"
	// KeySchema is the JSON Schema "$schema" field key.
	KeySchema = "$schema"
	// KeyDescription is the "description" field key.
	KeyDescription = "description"
	// KeyOperationID is the "operationId" field key.
	KeyOperationID = "operationId"
	// KeyDeprecated is the "deprecated" field key.
	KeyDeprecated = "deprecated"
	// KeyType is the "type" field key.
	KeyType = "type"
	// KeyFormat is the "format" field key.
	KeyFormat = "format"
	// KeyProperties is the "properties" field key.
	KeyProperties = "properties"
	// KeyItems is the "items" field key.
	KeyItems = "items"
	// KeyIn is the "in" field key for parameter location.
	KeyIn = "in"
	// KeyName is the "name" field key.
	KeyName = "name"
	// KeyTitle is the "title" field key.
	KeyTitle = "title"
	// KeyVersion is the "version" field key.
	KeyVersion = "version"

	// KeyAllOf is the "allOf" composition keyword.
	KeyAllOf = "allOf"
	// KeyAnyOf is the "anyOf" composition keyword.
	KeyAnyOf = "anyOf"
	// KeyOneOf is the "oneOf" composition keyword.
	KeyOneOf = "oneOf"

	// KeyXAPIVersion is the "x-api-version" extension key.
	KeyXAPIVersion = "x-api-version"
	// KeyXOperationGroup is the "x-operation-group" extension key.
	KeyXOperationGroup = "x-operation-group"
	// KeyXVersionAdded is the "x-version-added" extension key.
	KeyXVersionAdded = "x-version-added"
	// KeyXVersionRemoved is the "x-version-removed" extension key.
	KeyXVersionRemoved = "x-version-removed"
	// KeyXGlobal is the "x-global" extension key.
	KeyXGlobal = "x-global"
	// KeyXIgnorable is the "x-ignorable" extension key.
	KeyXIgnorable = "x-ignorable"

	// KeySupersededBy is the "superseded_by" key in superseded operations files.
	KeySupersededBy = "superseded_by"
	// KeyOperations is the "operations" key in superseded operations files.
	KeyOperations = "operations"

	// DirSchemas is the directory name containing schema definition files.
	DirSchemas = "schemas"
	// DirNamespaces is the directory name containing namespace definition files.
	DirNamespaces = "namespaces"
)

// ReadYAML reads and parses a YAML file, returning its document node.
func ReadYAML(path string) (*yaml.Node, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var doc yaml.Node
	if err := yaml.Unmarshal(data, &doc); err != nil {
		return nil, fmt.Errorf("parsing %s: %w", path, err)
	}
	return &doc, nil
}

// GetPath traverses a YAML document by successive mapping keys, returning
// the node at the end of the key path or nil if any key is not found.
func GetPath(doc *yaml.Node, keys ...string) *yaml.Node {
	node := doc
	if node.Kind == yaml.DocumentNode && len(node.Content) > 0 {
		node = node.Content[0]
	}
	for _, key := range keys {
		node = GetMappingValue(node, key)
		if node == nil {
			return nil
		}
	}
	return node
}

// GetMappingValue returns the value node for a given key in a mapping node,
// or nil if the node is not a mapping or the key is absent.
func GetMappingValue(node *yaml.Node, key string) *yaml.Node {
	if node == nil || node.Kind != yaml.MappingNode {
		return nil
	}
	for i := 0; i < len(node.Content)-1; i += 2 {
		if node.Content[i].Value == key {
			return node.Content[i+1]
		}
	}
	return nil
}

// ScalarValue returns the string value of a scalar node, or empty string
// if the node is nil or not a scalar.
func ScalarValue(node *yaml.Node) string {
	if node == nil || node.Kind != yaml.ScalarNode {
		return ""
	}
	return node.Value
}

// ForEachKV iterates over the key-value pairs of a mapping node, calling fn
// for each pair. Does nothing if node is nil or not a mapping.
func ForEachKV(node *yaml.Node, fn func(key string, value *yaml.Node)) {
	if node == nil || node.Kind != yaml.MappingNode {
		return
	}
	for i := 0; i < len(node.Content)-1; i += 2 {
		fn(node.Content[i].Value, node.Content[i+1])
	}
}

// GetRefValue extracts the $ref string from a mapping node, returning empty
// string if the node has no $ref field.
func GetRefValue(node *yaml.Node) string {
	if node == nil || node.Kind != yaml.MappingNode {
		return ""
	}
	return ScalarValue(GetMappingValue(node, "$ref"))
}

// AppendKV appends a key-value pair to a mapping node.
func AppendKV(mapping *yaml.Node, key string, value *yaml.Node) {
	mapping.Content = append(mapping.Content, ScalarNode(key), value)
}

// SetMappingValue sets a key's value in a mapping node, replacing the existing
// value if the key is present or appending a new entry otherwise.
func SetMappingValue(node *yaml.Node, key string, value *yaml.Node) {
	if node == nil || node.Kind != yaml.MappingNode {
		return
	}
	for i := 0; i < len(node.Content)-1; i += 2 {
		if node.Content[i].Value == key {
			node.Content[i+1] = value
			return
		}
	}
	AppendKV(node, key, value)
}

// ScalarNode creates a new YAML scalar node with the given string value.
func ScalarNode(val string) *yaml.Node {
	return &yaml.Node{Kind: yaml.ScalarNode, Value: val, Tag: "!!str"}
}

// BoolNode creates a new YAML boolean scalar node.
func BoolNode(val bool) *yaml.Node {
	v := "false"
	if val {
		v = "true"
	}
	return &yaml.Node{Kind: yaml.ScalarNode, Value: v, Tag: "!!bool"}
}

// MergeMapping appends all key-value pairs from src into dst.
func MergeMapping(dst, src *yaml.Node) {
	if src == nil || dst == nil {
		return
	}
	dst.Content = append(dst.Content, src.Content...)
}

// WalkRefs recursively visits all $ref values in a YAML tree, calling fn
// with each ref string and replacing it with fn's return value.
func WalkRefs(node *yaml.Node, fn func(string) string) {
	if node == nil {
		return
	}
	switch node.Kind {
	case yaml.DocumentNode:
		for _, c := range node.Content {
			WalkRefs(c, fn)
		}
	case yaml.MappingNode:
		for i := 0; i < len(node.Content)-1; i += 2 {
			key := node.Content[i]
			val := node.Content[i+1]
			if key.Value == "$ref" && val.Kind == yaml.ScalarNode {
				val.Value = fn(val.Value)
			} else {
				WalkRefs(val, fn)
			}
		}
	case yaml.SequenceNode:
		for _, c := range node.Content {
			WalkRefs(c, fn)
		}
	case yaml.ScalarNode, yaml.AliasNode:
		// no refs to walk
	}
}

// DeepCopy creates a recursive copy of a YAML node tree.
func DeepCopy(node *yaml.Node) *yaml.Node {
	if node == nil {
		return nil
	}
	cp := &yaml.Node{
		Kind:        node.Kind,
		Style:       node.Style,
		Tag:         node.Tag,
		Value:       node.Value,
		Anchor:      node.Anchor,
		HeadComment: node.HeadComment,
		LineComment: node.LineComment,
		FootComment: node.FootComment,
		Line:        node.Line,
		Column:      node.Column,
	}
	if len(node.Content) > 0 {
		cp.Content = make([]*yaml.Node, len(node.Content))
		for i, c := range node.Content {
			cp.Content[i] = DeepCopy(c)
		}
	}
	return cp
}
