package merger

import (
	"fmt"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/spec"
)

const globalParamsFile = "_global_parameters.yaml"

func (m *Merger) generateGlobalParams(merged *yaml.Node) error {
	doc, err := spec.ReadYAML(filepath.Join(m.root, globalParamsFile))
	if err != nil {
		return fmt.Errorf("reading %q: %w", globalParamsFile, err)
	}

	srcParams := spec.GetPath(doc, spec.KeyComponents, spec.KeyParameters)
	if srcParams == nil {
		return nil
	}

	spec.WalkRefs(srcParams, func(ref string) string {
		if !strings.HasPrefix(ref, spec.DirSchemas+"/") {
			return ref
		}
		ref = strings.TrimPrefix(ref, spec.DirSchemas+"/")
		ref = strings.Replace(ref, ".yaml#/"+spec.KeyComponents+"/"+spec.KeySchemas+"/", ":", 1)
		return schemasRefPrefix + ref
	})

	specParams := spec.GetPath(merged, spec.KeyComponents, spec.KeyParameters)

	var globalRefs []*yaml.Node
	var renamedPairs [][2]*yaml.Node

	spec.ForEachKV(srcParams, func(name string, param *yaml.Node) {
		paramIn := spec.ScalarValue(spec.GetMappingValue(param, spec.KeyIn))
		paramName := spec.ScalarValue(spec.GetMappingValue(param, spec.KeyName))
		if paramIn == "" || paramName == "" {
			return
		}

		newKey := "_global::" + paramIn + "." + paramName
		spec.SetMappingValue(param, spec.KeyXGlobal, spec.BoolNode(true))

		renamedPairs = append(renamedPairs, [2]*yaml.Node{spec.ScalarNode(newKey), param})

		refNode := &yaml.Node{Kind: yaml.MappingNode}
		spec.AppendKV(refNode, spec.KeyRef, spec.ScalarNode("#/"+spec.KeyComponents+"/"+spec.KeyParameters+"/"+newKey))
		globalRefs = append(globalRefs, refNode)
	})

	var newContent []*yaml.Node
	for _, p := range renamedPairs {
		newContent = append(newContent, p[0], p[1])
	}
	newContent = append(newContent, specParams.Content...)
	specParams.Content = newContent

	paths := spec.GetPath(merged, spec.KeyPaths)
	spec.ForEachKV(paths, func(_ string, pathItem *yaml.Node) {
		spec.ForEachKV(pathItem, func(method string, operation *yaml.Node) {
			if operation.Kind != yaml.MappingNode {
				return
			}
			params := spec.GetMappingValue(operation, spec.KeyParameters)
			if params == nil {
				params = &yaml.Node{Kind: yaml.SequenceNode}
				spec.AppendKV(operation, spec.KeyParameters, params)
			}
			params.Style &^= yaml.FlowStyle
			for _, ref := range globalRefs {
				params.Content = append(params.Content, spec.DeepCopy(ref))
			}
		})
	})

	return nil
}
