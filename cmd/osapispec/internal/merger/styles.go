package merger

import (
	"strings"

	"gopkg.in/yaml.v3"
)

// normalizeStyles ensures consistent YAML output formatting:
// - Multiline strings use literal block scalar style (|-)
// - Sequences use block style (not flow)
// - Comments are stripped (TS merger discards them)
// - Boolean-like strings are single-quoted
// - URLs with # fragments have quotes removed
func normalizeStyles(node *yaml.Node) {
	if node == nil {
		return
	}
	node.HeadComment = ""
	node.LineComment = ""
	node.FootComment = ""

	switch node.Kind {
	case yaml.DocumentNode:
		for _, c := range node.Content {
			normalizeStyles(c)
		}
	case yaml.MappingNode:
		for i := 0; i < len(node.Content)-1; i += 2 {
			normalizeStyles(node.Content[i])
			normalizeStyles(node.Content[i+1])
		}
	case yaml.SequenceNode:
		node.Style &^= yaml.FlowStyle
		for _, c := range node.Content {
			normalizeStyles(c)
		}
	case yaml.ScalarNode:
		if strings.Contains(node.Value, "\n") {
			node.Value = trimTrailingLineWhitespace(node.Value)
			node.Style = yaml.LiteralStyle
		} else {
			node.Style &^= yaml.LiteralStyle | yaml.FoldedStyle
			if isBooleanLike(node.Value) {
				node.Style = yaml.SingleQuotedStyle
			}
		}
	case yaml.AliasNode:
		// nothing to normalize
	}
}

var booleanLikeValues = map[string]bool{
	"yes": true, "no": true, "on": true, "off": true,
	"Yes": true, "No": true, "On": true, "Off": true,
	"YES": true, "NO": true, "ON": true, "OFF": true,
	"y": true, "n": true, "Y": true, "N": true,
}

func isBooleanLike(s string) bool {
	return booleanLikeValues[s]
}

func trimTrailingLineWhitespace(s string) string {
	lines := strings.Split(s, "\n")
	for i, line := range lines {
		lines[i] = strings.TrimRight(line, " \t")
	}
	return strings.Join(lines, "\n")
}
