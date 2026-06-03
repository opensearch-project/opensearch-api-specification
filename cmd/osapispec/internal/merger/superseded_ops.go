package merger

import (
	"fmt"
	"path/filepath"
	"regexp"
	"strings"

	"gopkg.in/yaml.v3"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/spec"
)

const supersededOpsFile = "_superseded_operations.yaml"

func (m *Merger) generateSupersededOps(merged *yaml.Node) error {
	doc, err := spec.ReadYAML(filepath.Join(m.root, supersededOpsFile))
	if err != nil {
		return fmt.Errorf("reading %q: %w", supersededOpsFile, err)
	}

	root := doc
	if root.Kind == yaml.DocumentNode && len(root.Content) > 0 {
		root = root.Content[0]
	}

	paths := spec.GetPath(merged, spec.KeyPaths)

	spec.ForEachKV(root, func(supersededPath string, entry *yaml.Node) {
		if supersededPath == spec.KeySchema {
			return
		}

		supersededBy := spec.ScalarValue(spec.GetMappingValue(entry, spec.KeySupersededBy))
		if supersededBy == "" {
			return
		}

		operations := collectSequenceStrings(spec.GetMappingValue(entry, spec.KeyOperations))
		if len(operations) == 0 {
			return
		}

		sourcePath := findMatchingPath(paths, supersededBy)
		if sourcePath == "" {
			return
		}

		sourcePathItem := spec.GetMappingValue(paths, sourcePath)
		if sourcePathItem == nil {
			return
		}

		outputPath := copyParams(sourcePath, supersededPath)

		newPathItem := &yaml.Node{Kind: yaml.MappingNode}
		for _, op := range operations {
			method := strings.ToLower(op)
			sourceOp := spec.GetMappingValue(sourcePathItem, method)
			if sourceOp == nil {
				continue
			}

			cloned := spec.DeepCopy(sourceOp)
			markSuperseded(cloned)
			spec.AppendKV(newPathItem, method, cloned)
		}

		if len(newPathItem.Content) > 0 {
			spec.AppendKV(paths, outputPath, newPathItem)
		}
	})

	return nil
}

// copyParams replaces path parameter names in the target path with those from the source path.
func copyParams(sourcePath, targetPath string) string {
	sourceParams := pathParamRE.FindAllString(sourcePath, -1)
	targetParams := pathParamRE.FindAllString(targetPath, -1)

	if len(sourceParams) != len(targetParams) {
		return targetPath
	}

	result := targetPath
	for i, tp := range targetParams {
		result = strings.Replace(result, tp, sourceParams[i], 1)
	}
	return result
}

func findMatchingPath(paths *yaml.Node, pattern string) string {
	re := pathToRegex(pattern)
	var match string
	spec.ForEachKV(paths, func(path string, _ *yaml.Node) {
		if match != "" {
			return
		}
		if re.MatchString(path) {
			match = path
		}
	})
	return match
}

var pathParamRE = regexp.MustCompile(`\{[^}]+\}`)

func pathToRegex(path string) *regexp.Regexp {
	escaped := regexp.QuoteMeta(path)
	// Replace escaped path params with wildcard matchers
	escaped = strings.ReplaceAll(escaped, `\{`, "{")
	escaped = strings.ReplaceAll(escaped, `\}`, "}")
	re := pathParamRE.ReplaceAllString(escaped, `\{[^}]+\}`)
	return regexp.MustCompile("^" + re + "$")
}

func markSuperseded(operation *yaml.Node) {
	opID := spec.GetMappingValue(operation, spec.KeyOperationID)
	if opID != nil && opID.Kind == yaml.ScalarNode {
		opID.Value += "_superseded"
	}

	spec.SetMappingValue(operation, spec.KeyDeprecated, spec.BoolNode(true))
	spec.SetMappingValue(operation, spec.KeyXIgnorable, spec.BoolNode(true))
}

func collectSequenceStrings(node *yaml.Node) []string {
	if node == nil || node.Kind != yaml.SequenceNode {
		return nil
	}
	result := make([]string, 0, len(node.Content))
	for _, c := range node.Content {
		if c.Kind == yaml.ScalarNode {
			result = append(result, c.Value)
		}
	}
	return result
}
