package merger

import (
	"fmt"
	"strings"

	"gopkg.in/yaml.v3"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/spec"
)

// ExtractVersion removes spec elements not applicable to the given target version.
func ExtractVersion(merged *yaml.Node, version string) (*yaml.Node, error) {
	target, err := coerceVersion(version)
	if err != nil {
		return nil, fmt.Errorf("invalid version %q: %w", version, err)
	}

	result := spec.DeepCopy(merged)

	removeKeysNotMatchingSemver(result, target)
	removeUnused(result)

	return result, nil
}

func removeKeysNotMatchingSemver(node *yaml.Node, target semver) {
	deleteMatchingKeys(node, func(n *yaml.Node) bool {
		return excludePerSemver(n, target)
	})
}

func excludePerSemver(node *yaml.Node, target semver) bool {
	if node == nil || node.Kind != yaml.MappingNode {
		return false
	}

	added := spec.ScalarValue(spec.GetMappingValue(node, spec.KeyXVersionAdded))
	if added != "" {
		v, err := coerceVersion(added)
		if err == nil && target.LessThan(v) {
			return true
		}
	}

	removed := spec.ScalarValue(spec.GetMappingValue(node, spec.KeyXVersionRemoved))
	if removed != "" {
		v, err := coerceVersion(removed)
		if err == nil && !target.LessThan(v) {
			return true
		}
	}

	return false
}

func removeUnused(merged *yaml.Node) {
	refs := findAllRefs(spec.GetPath(merged, spec.KeyPaths), merged)

	for _, section := range []string{spec.KeyParameters, spec.KeyRequestBodies, spec.KeyResponses, spec.KeySchemas} {
		node := spec.GetPath(merged, spec.KeyComponents, section)
		if node == nil || node.Kind != yaml.MappingNode {
			continue
		}
		filterMappingByRefs(node, "#/"+spec.KeyComponents+"/"+section+"/", refs)
	}

	remainingRefs := collectComponentRefs(merged)
	deleteDanglingRefs(merged, remainingRefs)

	removeEmptyPaths(merged)
}

func findAllRefs(node *yaml.Node, root *yaml.Node) map[string]bool {
	refs := make(map[string]bool)
	findRefsRecursive(node, root, refs, make(map[string]bool))
	return refs
}

func findRefsRecursive(node *yaml.Node, root *yaml.Node, refs map[string]bool, visited map[string]bool) {
	if node == nil {
		return
	}
	switch node.Kind {
	case yaml.DocumentNode:
		findRefsInDocument(node, root, refs, visited)
	case yaml.MappingNode:
		findRefsInMapping(node, root, refs, visited)
	case yaml.SequenceNode:
		findRefsInSequence(node, root, refs, visited)
	case yaml.ScalarNode, yaml.AliasNode:
		// no refs to follow
	}
}

func findRefsInDocument(node *yaml.Node, root *yaml.Node, refs map[string]bool, visited map[string]bool) {
	for _, c := range node.Content {
		findRefsRecursive(c, root, refs, visited)
	}
}

func findRefsInMapping(node *yaml.Node, root *yaml.Node, refs map[string]bool, visited map[string]bool) {
	for i := 0; i < len(node.Content)-1; i += 2 {
		key := node.Content[i]
		val := node.Content[i+1]
		if key.Value == spec.KeyRef && val.Kind == yaml.ScalarNode {
			chaseRef(val.Value, root, refs, visited)
		} else {
			findRefsRecursive(val, root, refs, visited)
		}
	}
}

func findRefsInSequence(node *yaml.Node, root *yaml.Node, refs map[string]bool, visited map[string]bool) {
	for _, c := range node.Content {
		findRefsRecursive(c, root, refs, visited)
	}
}

func chaseRef(ref string, root *yaml.Node, refs map[string]bool, visited map[string]bool) {
	if refs[ref] {
		return
	}
	refs[ref] = true
	if visited[ref] {
		return
	}
	visited[ref] = true
	if resolved := resolveRef(ref, root); resolved != nil {
		findRefsRecursive(resolved, root, refs, visited)
	}
}

func resolveRef(ref string, root *yaml.Node) *yaml.Node {
	if !strings.HasPrefix(ref, "#/") {
		return nil
	}
	parts := strings.Split(ref[2:], "/")
	node := root
	if node.Kind == yaml.DocumentNode && len(node.Content) > 0 {
		node = node.Content[0]
	}
	for _, part := range parts {
		// JSON Pointer unescaping
		part = strings.ReplaceAll(part, "~1", "/")
		part = strings.ReplaceAll(part, "~0", "~")
		node = spec.GetMappingValue(node, part)
		if node == nil {
			return nil
		}
	}
	return node
}

func filterMappingByRefs(node *yaml.Node, prefix string, refs map[string]bool) {
	var kept []*yaml.Node
	for i := 0; i < len(node.Content)-1; i += 2 {
		key := node.Content[i].Value
		if refs[prefix+key] {
			kept = append(kept, node.Content[i], node.Content[i+1])
		}
	}
	node.Content = kept
}

func collectComponentRefs(merged *yaml.Node) map[string]bool {
	refs := make(map[string]bool)
	components := spec.GetPath(merged, spec.KeyComponents)
	if components == nil {
		return refs
	}
	spec.ForEachKV(components, func(section string, sectionNode *yaml.Node) {
		spec.ForEachKV(sectionNode, func(key string, _ *yaml.Node) {
			refs["#/"+spec.KeyComponents+"/"+section+"/"+key] = true
		})
	})
	return refs
}

var componentsRefPrefix = "#/" + spec.KeyComponents + "/"

func deleteDanglingRefs(node *yaml.Node, validRefs map[string]bool) {
	if node == nil {
		return
	}
	switch node.Kind {
	case yaml.DocumentNode:
		for _, c := range node.Content {
			deleteDanglingRefs(c, validRefs)
		}
	case yaml.MappingNode:
		var kept []*yaml.Node
		for i := 0; i < len(node.Content)-1; i += 2 {
			key := node.Content[i]
			val := node.Content[i+1]
			if key.Value == "$ref" && val.Kind == yaml.ScalarNode && strings.HasPrefix(val.Value, componentsRefPrefix) {
				if !validRefs[val.Value] {
					continue
				}
			}
			kept = append(kept, key, val)
			deleteDanglingRefs(val, validRefs)
		}
		node.Content = kept
	case yaml.SequenceNode:
		var kept []*yaml.Node
		for _, c := range node.Content {
			if c.Kind == yaml.MappingNode && len(c.Content) == 2 {
				k := c.Content[0]
				v := c.Content[1]
				if k.Value == spec.KeyRef && v.Kind == yaml.ScalarNode && strings.HasPrefix(v.Value, componentsRefPrefix) {
					if !validRefs[v.Value] {
						continue
					}
				}
			}
			deleteDanglingRefs(c, validRefs)
			kept = append(kept, c)
		}
		node.Content = kept
	case yaml.ScalarNode, yaml.AliasNode:
		// no refs to process
	}
}

func removeEmptyPaths(merged *yaml.Node) {
	paths := spec.GetPath(merged, spec.KeyPaths)
	if paths == nil {
		return
	}
	var kept []*yaml.Node
	for i := 0; i < len(paths.Content)-1; i += 2 {
		val := paths.Content[i+1]
		if val.Kind == yaml.MappingNode && len(val.Content) > 0 {
			kept = append(kept, paths.Content[i], val)
		}
	}
	paths.Content = kept
}

func deleteMatchingKeys(node *yaml.Node, condition func(*yaml.Node) bool) {
	if node == nil {
		return
	}
	switch node.Kind {
	case yaml.DocumentNode:
		for _, c := range node.Content {
			deleteMatchingKeys(c, condition)
		}
	case yaml.MappingNode:
		var kept []*yaml.Node
		for i := 0; i < len(node.Content)-1; i += 2 {
			val := node.Content[i+1]
			if condition(val) {
				continue
			}
			deleteMatchingKeys(val, condition)
			kept = append(kept, node.Content[i], val)
		}
		node.Content = kept
	case yaml.SequenceNode:
		var kept []*yaml.Node
		for _, c := range node.Content {
			if condition(c) {
				continue
			}
			deleteMatchingKeys(c, condition)
			kept = append(kept, c)
		}
		node.Content = kept
	case yaml.ScalarNode, yaml.AliasNode:
		// nothing to filter
	}
}

// Minimal semver for version comparison
type semver struct {
	major, minor, patch int
}

// LessThan reports whether s precedes other in semver ordering.
func (s semver) LessThan(other semver) bool {
	if s.major != other.major {
		return s.major < other.major
	}
	if s.minor != other.minor {
		return s.minor < other.minor
	}
	return s.patch < other.patch
}

func coerceVersion(v string) (semver, error) {
	v = strings.TrimPrefix(v, "v")
	v = strings.TrimRight(v, "'\"")

	parts := strings.SplitN(v, ".", 3)
	var s semver
	if len(parts) >= 1 {
		if _, err := fmt.Sscanf(parts[0], "%d", &s.major); err != nil {
			return s, fmt.Errorf("invalid major version: %s", parts[0])
		}
	}
	if len(parts) >= 2 {
		if _, err := fmt.Sscanf(parts[1], "%d", &s.minor); err != nil {
			return s, fmt.Errorf("invalid minor version: %s", parts[1])
		}
	}
	if len(parts) >= 3 {
		if _, err := fmt.Sscanf(parts[2], "%d", &s.patch); err != nil {
			return s, fmt.Errorf("invalid patch version: %s", parts[2])
		}
	}
	return s, nil
}
