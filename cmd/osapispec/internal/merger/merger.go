package merger

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strings"

	"golang.org/x/text/collate"
	"golang.org/x/text/language"
	"gopkg.in/yaml.v3"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/spec"
)

var collator = collate.New(language.Und)

// Run is the entry point for the "merge" subcommand.
func Run(args []string) {
	fs := flag.NewFlagSet("merge", flag.ExitOnError)
	source := fs.String("source", "spec", "Root folder containing the spec fragments")
	output := fs.String("output", "build/opensearch-openapi.yaml", "Output file path")
	version := fs.String("version", "", "Target OpenSearch version to extract")

	if err := fs.Parse(args); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	m, err := NewMerger(*source)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	spec, err := m.Merge()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	if *version != "" {
		spec, err = ExtractVersion(spec, *version)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			os.Exit(1)
		}
	}

	if err := WriteYAML(*output, spec); err != nil {
		fmt.Fprintf(os.Stderr, "error writing output: %v\n", err)
		os.Exit(1)
	}
}

// Merger merges OpenAPI spec fragments from a root directory into a single document.
type Merger struct {
	root string
}

// NewMerger creates a Merger rooted at the given spec directory.
func NewMerger(root string) (*Merger, error) {
	abs, err := filepath.Abs(root)
	if err != nil {
		return nil, fmt.Errorf("resolving root path: %w", err)
	}
	return &Merger{root: abs}, nil
}

const infoFile = "_info.yaml"

// Merge combines all spec fragments into a single OpenAPI document.
func (m *Merger) Merge() (*yaml.Node, error) {
	info, err := spec.ReadYAML(filepath.Join(m.root, infoFile))
	if err != nil {
		return nil, fmt.Errorf("reading %q: %w", infoFile, err)
	}

	merged := buildBaseSpec(info)

	if err := m.mergeSchemas(merged); err != nil {
		return nil, fmt.Errorf("merging schemas: %w", err)
	}

	if err := m.mergeNamespaces(merged); err != nil {
		return nil, fmt.Errorf("merging namespaces: %w", err)
	}

	sortSpecKeys(merged)
	addDefaults(merged)

	if err := m.generateGlobalParams(merged); err != nil {
		return nil, fmt.Errorf("generating global params: %w", err)
	}

	if err := m.generateSupersededOps(merged); err != nil {
		return nil, fmt.Errorf("generating superseded ops: %w", err)
	}

	normalizeFields(merged)
	normalizeStyles(merged)

	return merged, nil
}

func buildBaseSpec(info *yaml.Node) *yaml.Node {
	infoMapping := extractMapping(info, spec.KeyTitle, spec.KeyVersion, spec.KeyXAPIVersion)

	doc := &yaml.Node{Kind: yaml.DocumentNode}
	root := &yaml.Node{Kind: yaml.MappingNode}
	doc.Content = append(doc.Content, root)

	spec.AppendKV(root, spec.KeyOpenAPI, spec.ScalarNode(spec.OpenAPIVersion))
	spec.AppendKV(root, spec.KeyInfo, infoMapping)
	spec.AppendKV(root, spec.KeyPaths, &yaml.Node{Kind: yaml.MappingNode})

	components := &yaml.Node{Kind: yaml.MappingNode}
	spec.AppendKV(components, spec.KeyParameters, &yaml.Node{Kind: yaml.MappingNode})
	spec.AppendKV(components, spec.KeyRequestBodies, &yaml.Node{Kind: yaml.MappingNode})
	spec.AppendKV(components, spec.KeyResponses, &yaml.Node{Kind: yaml.MappingNode})
	spec.AppendKV(components, spec.KeySchemas, &yaml.Node{Kind: yaml.MappingNode})
	spec.AppendKV(root, spec.KeyComponents, components)

	return doc
}

func (m *Merger) mergeSchemas(merged *yaml.Node) error {
	schemasDir := filepath.Join(m.root, spec.DirSchemas)
	entries, err := os.ReadDir(schemasDir)
	if err != nil {
		return fmt.Errorf("reading schemas directory: %w", err)
	}

	schemasNode := spec.GetPath(merged, spec.KeyComponents, spec.KeySchemas)

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".yaml") {
			continue
		}
		category := strings.TrimSuffix(entry.Name(), ".yaml")

		doc, err := spec.ReadYAML(filepath.Join(schemasDir, entry.Name()))
		if err != nil {
			return fmt.Errorf("reading schema %s: %w", entry.Name(), err)
		}

		fileSchemas := spec.GetPath(doc, spec.KeyComponents, spec.KeySchemas)
		if fileSchemas == nil {
			continue
		}

		redirectRefsInSchema(fileSchemas, category)

		spec.ForEachKV(fileSchemas, func(name string, value *yaml.Node) {
			key := category + ":" + name
			spec.AppendKV(schemasNode, key, value)
		})
	}

	return nil
}

func (m *Merger) mergeNamespaces(merged *yaml.Node) error {
	nsDir := filepath.Join(m.root, spec.DirNamespaces)
	entries, err := os.ReadDir(nsDir)
	if err != nil {
		return fmt.Errorf("reading namespaces directory: %w", err)
	}

	paths := spec.GetPath(merged, spec.KeyPaths)
	params := spec.GetPath(merged, spec.KeyComponents, spec.KeyParameters)
	requestBodies := spec.GetPath(merged, spec.KeyComponents, spec.KeyRequestBodies)
	responses := spec.GetPath(merged, spec.KeyComponents, spec.KeyResponses)

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".yaml") {
			continue
		}

		doc, err := spec.ReadYAML(filepath.Join(nsDir, entry.Name()))
		if err != nil {
			return fmt.Errorf("reading namespace %s: %w", entry.Name(), err)
		}

		redirectRefsInNamespace(doc)

		if nsPaths := spec.GetPath(doc, spec.KeyPaths); nsPaths != nil {
			spec.MergeMapping(paths, nsPaths)
		}
		if nsParams := spec.GetPath(doc, spec.KeyComponents, spec.KeyParameters); nsParams != nil {
			spec.MergeMapping(params, nsParams)
		}
		if nsReqBodies := spec.GetPath(doc, spec.KeyComponents, spec.KeyRequestBodies); nsReqBodies != nil {
			spec.MergeMapping(requestBodies, nsReqBodies)
		}
		if nsResponses := spec.GetPath(doc, spec.KeyComponents, spec.KeyResponses); nsResponses != nil {
			spec.MergeMapping(responses, nsResponses)
		}
	}

	return nil
}

var externalSchemaRefRE = regexp.MustCompile(`^(.*?)\.yaml#/components/schemas/(.*)$`)

var schemasRefPrefix = "#/" + spec.KeyComponents + "/" + spec.KeySchemas + "/"

func redirectRefsInSchema(node *yaml.Node, category string) {
	spec.WalkRefs(node, func(ref string) string {
		if strings.HasPrefix(ref, schemasRefPrefix) {
			name := ref[len(schemasRefPrefix):]
			return schemasRefPrefix + category + ":" + name
		}
		matches := externalSchemaRefRE.FindStringSubmatch(ref)
		if matches != nil {
			return schemasRefPrefix + matches[1] + ":" + matches[2]
		}
		return ref
	})
}

func redirectRefsInNamespace(node *yaml.Node) {
	spec.WalkRefs(node, func(ref string) string {
		if !strings.HasPrefix(ref, "../"+spec.DirSchemas+"/") {
			return ref
		}
		ref = strings.TrimPrefix(ref, "../"+spec.DirSchemas+"/")
		ref = strings.Replace(ref, ".yaml#/"+spec.KeyComponents+"/"+spec.KeySchemas+"/", ":", 1)
		return schemasRefPrefix + ref
	})
}

func sortSpecKeys(merged *yaml.Node) {
	sortMappingKeys(spec.GetPath(merged, spec.KeyPaths))
	sortMappingKeys(spec.GetPath(merged, spec.KeyComponents, spec.KeySchemas))
	sortMappingKeys(spec.GetPath(merged, spec.KeyComponents, spec.KeyParameters))
	sortMappingKeys(spec.GetPath(merged, spec.KeyComponents, spec.KeyRequestBodies))
	sortMappingKeys(spec.GetPath(merged, spec.KeyComponents, spec.KeyResponses))

	spec.ForEachKV(spec.GetPath(merged, spec.KeyPaths), func(_ string, pathItem *yaml.Node) {
		sortMappingKeys(pathItem)
		spec.ForEachKV(pathItem, func(_ string, operation *yaml.Node) {
			sortMappingKeys(spec.GetMappingValue(operation, spec.KeyResponses))
		})
	})
}

func addDefaults(merged *yaml.Node) {
	responses := spec.GetPath(merged, spec.KeyComponents, spec.KeyResponses)
	if responses == nil {
		return
	}
	spec.ForEachKV(responses, func(_ string, resp *yaml.Node) {
		if resp.Kind != yaml.MappingNode {
			return
		}
		if spec.GetMappingValue(resp, spec.KeyDescription) == nil {
			spec.AppendKV(resp, spec.KeyDescription, &yaml.Node{
				Kind:  yaml.ScalarNode,
				Value: "",
				Tag:   "!!str",
				Style: yaml.SingleQuotedStyle,
			})
		}
	})
}

var normalizeReplacer = strings.NewReplacer("::", "___", "@", "___", ":", "___")

func normalizeFields(spec *yaml.Node) {
	normalizeNode(spec)
}

func normalizeNode(node *yaml.Node) {
	if node == nil {
		return
	}
	switch node.Kind {
	case yaml.DocumentNode:
		for _, c := range node.Content {
			normalizeNode(c)
		}
	case yaml.MappingNode:
		for i := 0; i < len(node.Content)-1; i += 2 {
			key := node.Content[i]
			val := node.Content[i+1]
			normalized := normalizeReplacer.Replace(key.Value)
			if normalized != key.Value {
				key.Value = normalized
			}
			normalizeNode(val)
		}
	case yaml.SequenceNode:
		for _, c := range node.Content {
			normalizeNode(c)
		}
	case yaml.ScalarNode:
		if strings.HasPrefix(node.Value, "#/") {
			normalized := normalizeReplacer.Replace(node.Value)
			if normalized != node.Value {
				node.Value = normalized
			}
		}
	case yaml.AliasNode:
		// nothing to normalize
	}
}

// WriteYAML writes a YAML document to the given file path.
func WriteYAML(path string, doc *yaml.Node) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	enc := yaml.NewEncoder(f)
	enc.SetIndent(2)
	return enc.Encode(doc)
}

func sortMappingKeys(node *yaml.Node) {
	if node == nil || node.Kind != yaml.MappingNode || len(node.Content) < 4 {
		return
	}
	n := len(node.Content) / 2
	type pair struct {
		key *yaml.Node
		val *yaml.Node
	}
	pairs := make([]pair, n)
	for i := range n {
		pairs[i] = pair{node.Content[i*2], node.Content[i*2+1]}
	}
	slices.SortFunc(pairs, func(a, b pair) int {
		return collator.CompareString(a.key.Value, b.key.Value)
	})
	for i, p := range pairs {
		node.Content[i*2] = p.key
		node.Content[i*2+1] = p.val
	}
}

func extractMapping(doc *yaml.Node, keys ...string) *yaml.Node {
	node := doc
	if node.Kind == yaml.DocumentNode && len(node.Content) > 0 {
		node = node.Content[0]
	}
	if node.Kind != yaml.MappingNode {
		return &yaml.Node{Kind: yaml.MappingNode}
	}
	result := &yaml.Node{Kind: yaml.MappingNode}
	keySet := make(map[string]bool, len(keys))
	for _, k := range keys {
		keySet[k] = true
	}
	for i := 0; i < len(node.Content)-1; i += 2 {
		if keySet[node.Content[i].Value] {
			result.Content = append(result.Content, node.Content[i], node.Content[i+1])
		}
	}
	return result
}
