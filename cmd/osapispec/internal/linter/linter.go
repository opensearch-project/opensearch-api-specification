// Package linter validates OpenSearch API specification structure and naming conventions.
package linter

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"gopkg.in/yaml.v3"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/spec"
)

const coreNamespace = "_core"

// Run is the entry point for the "lint" subcommand.
func Run(args []string) {
	fs := flag.NewFlagSet("lint", flag.ExitOnError)
	source := fs.String("source", "spec", "Root folder containing the spec fragments")
	verbose := fs.Bool("verbose", false, "Show detailed validation output")

	if err := fs.Parse(args); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	l, err := NewLinter(*source)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	errors := l.Lint()

	for _, e := range errors {
		fmt.Fprintf(os.Stderr, "%s\n", e)
	}
	if *verbose && len(errors) == 0 {
		fmt.Println("No linting errors found.")
	}

	if len(errors) > 0 {
		os.Exit(1)
	}
}

// ValidationError represents a single linting error with file and location context.
type ValidationError struct {
	File     string
	Location string
	Message  string
}

// String formats the error as "file#/location: message" or "file: message".
func (e ValidationError) String() string {
	if e.Location != "" {
		return fmt.Sprintf("%s#/%s: %s", e.File, e.Location, e.Message)
	}
	return fmt.Sprintf("%s: %s", e.File, e.Message)
}

// Linter validates spec files under a given root directory.
type Linter struct {
	root string
}

// NewLinter creates a linter for the given spec root directory.
func NewLinter(root string) (*Linter, error) {
	abs, err := filepath.Abs(root)
	if err != nil {
		return nil, fmt.Errorf("resolving root path: %w", err)
	}
	return &Linter{root: abs}, nil
}

// Lint runs all validation rules and returns any errors found.
func (l *Linter) Lint() []ValidationError {
	//nolint:prealloc // size unknown upfront
	var errors []ValidationError

	errors = append(errors, l.lintSchemaFiles()...)
	errors = append(errors, l.lintNamespaceFiles()...)
	errors = append(errors, l.lintSchemaRefs()...)

	return errors
}

var (
	namespaceNameRE  = regexp.MustCompile(`^[a-z]+[a-z_]*[a-z]+$`)
	schemaFileNameRE = regexp.MustCompile(`^[a-z_]+\.[a-z_]+$`)
	schemaNameRE     = regexp.MustCompile(`^[A-Za-z0-9]+$`)
	operationGroupRE = regexp.MustCompile(`^([a-z]+[a-z_]*[a-z]+\.)?([a-z]+[a-z0-9_]*[a-z0-9]+)$`)
	parameterNameRE  = regexp.MustCompile(`^[a-zA-Z0-9._]+$`)
	descriptionRE    = regexp.MustCompile(`(?s)^\p{Lu}.*\.$`)
	numberFormatRE   = regexp.MustCompile(`^(float|double)$`)
	integerFormatRE  = regexp.MustCompile(`^(int32|int64)$`)
)

func (l *Linter) lintSchemaFiles() []ValidationError {
	var errors []ValidationError
	schemasDir := filepath.Join(l.root, spec.DirSchemas)

	entries, err := os.ReadDir(schemasDir)
	if err != nil {
		return []ValidationError{{File: schemasDir, Message: fmt.Sprintf("cannot read directory: %v", err)}}
	}

	schemasLoc := spec.KeyComponents + "/" + spec.KeySchemas + "/"

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".yaml") {
			continue
		}

		category := strings.TrimSuffix(entry.Name(), ".yaml")
		filePath := filepath.Join(schemasDir, entry.Name())

		if category != "_common" && !schemaFileNameRE.MatchString(category) {
			errors = append(errors, ValidationError{
				File:    filePath,
				Message: fmt.Sprintf("schema file name %q does not match pattern %s", category, schemaFileNameRE.String()),
			})
		}

		doc, err := spec.ReadYAML(filePath)
		if err != nil {
			errors = append(errors, ValidationError{File: filePath, Message: fmt.Sprintf("cannot parse: %v", err)})
			continue
		}

		schemas := spec.GetPath(doc, spec.KeyComponents, spec.KeySchemas)
		if schemas == nil {
			continue
		}

		spec.ForEachKV(schemas, func(name string, schema *yaml.Node) {
			if !schemaNameRE.MatchString(name) {
				errors = append(errors, ValidationError{
					File:     filePath,
					Location: schemasLoc + name,
					Message:  fmt.Sprintf("schema name %q must be alphanumeric (PascalCase)", name),
				})
			}
			errors = append(errors, validateSchemaFormats(filePath, schemasLoc+name, schema)...)
		})
	}

	return errors
}

func (l *Linter) lintNamespaceFiles() []ValidationError {
	var errors []ValidationError
	nsDir := filepath.Join(l.root, spec.DirNamespaces)

	entries, err := os.ReadDir(nsDir)
	if err != nil {
		return []ValidationError{{File: nsDir, Message: fmt.Sprintf("cannot read directory: %v", err)}}
	}

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".yaml") {
			continue
		}

		namespace := strings.TrimSuffix(entry.Name(), ".yaml")
		filePath := filepath.Join(nsDir, entry.Name())

		if namespace != coreNamespace && !namespaceNameRE.MatchString(namespace) {
			errors = append(errors, ValidationError{
				File:    filePath,
				Message: fmt.Sprintf("namespace name %q does not match pattern %s", namespace, namespaceNameRE.String()),
			})
		}

		doc, err := spec.ReadYAML(filePath)
		if err != nil {
			errors = append(errors, ValidationError{File: filePath, Message: fmt.Sprintf("cannot parse: %v", err)})
			continue
		}

		if spec.GetPath(doc, spec.KeyComponents, spec.KeySchemas) != nil {
			errors = append(errors, ValidationError{
				File:    filePath,
				Message: "namespace files must not define components.schemas inline",
			})
		}

		errors = append(errors, l.lintOperations(filePath, namespace, doc)...)
	}

	return errors
}

func (l *Linter) lintOperations(filePath, namespace string, doc *yaml.Node) []ValidationError {
	var errors []ValidationError

	paths := spec.GetPath(doc, spec.KeyPaths)
	if paths == nil {
		return nil
	}

	spec.ForEachKV(paths, func(path string, pathItem *yaml.Node) {
		spec.ForEachKV(pathItem, func(method string, operation *yaml.Node) {
			if operation.Kind != yaml.MappingNode {
				return
			}
			loc := "paths/" + path + "/" + method
			errors = append(errors, l.lintOperation(filePath, loc, namespace, operation)...)
		})
	})

	return errors
}

func (l *Linter) lintOperation(filePath, loc, namespace string, operation *yaml.Node) []ValidationError {
	var errors []ValidationError

	group := spec.ScalarValue(spec.GetMappingValue(operation, spec.KeyXOperationGroup))
	errors = append(errors, validateOperationGroup(filePath, loc, namespace, group)...)

	opID := spec.ScalarValue(spec.GetMappingValue(operation, spec.KeyOperationID))
	if opID != "" && group != "" {
		expectedPrefix := group + "."
		if !strings.HasPrefix(opID, expectedPrefix) {
			errors = append(errors, ValidationError{
				File: filePath, Location: loc,
				Message: fmt.Sprintf("operationId %q must start with %q", opID, expectedPrefix),
			})
		}
	}

	desc := spec.ScalarValue(spec.GetMappingValue(operation, spec.KeyDescription))
	errors = append(errors, validateDescription(filePath, loc, desc)...)

	params := spec.GetMappingValue(operation, spec.KeyParameters)
	if params != nil && params.Kind == yaml.SequenceNode {
		errors = append(errors, validateParameterRefs(filePath, loc, params)...)
	}

	return errors
}

func validateOperationGroup(filePath, loc, namespace, group string) []ValidationError {
	if group == "" {
		return []ValidationError{{File: filePath, Location: loc, Message: "missing x-operation-group"}}
	}
	if !operationGroupRE.MatchString(group) {
		return []ValidationError{{
			File: filePath, Location: loc,
			Message: fmt.Sprintf("x-operation-group %q does not match expected pattern", group),
		}}
	}
	parts := strings.SplitN(group, ".", 2)
	if len(parts) == 2 && namespace != coreNamespace && parts[0] != namespace {
		return []ValidationError{{
			File: filePath, Location: loc,
			Message: fmt.Sprintf(
				"x-operation-group namespace %q does not match file namespace %q",
				parts[0], namespace,
			),
		}}
	}
	return nil
}

func validateDescription(filePath, loc, desc string) []ValidationError {
	if desc == "" {
		return []ValidationError{{File: filePath, Location: loc, Message: "missing description"}}
	}
	if !descriptionRE.MatchString(desc) {
		return []ValidationError{{
			File: filePath, Location: loc,
			Message: "description must start with uppercase and end with period",
		}}
	}
	return nil
}

func validateParameterRefs(filePath, loc string, params *yaml.Node) []ValidationError {
	var errors []ValidationError
	for _, param := range params.Content {
		ref := spec.GetRefValue(param)
		if ref == "" {
			continue
		}
		// Extract parameter name from ref like #/components/parameters/group::query.name
		parts := strings.Split(ref, "/")
		if len(parts) < 4 {
			continue
		}
		paramKey := parts[len(parts)-1]
		if dotIdx := strings.LastIndex(paramKey, "."); dotIdx >= 0 {
			name := paramKey[dotIdx+1:]
			if !parameterNameRE.MatchString(name) {
				errors = append(errors, ValidationError{
					File:     filePath,
					Location: loc + "/parameters",
					Message:  fmt.Sprintf("parameter name %q contains invalid characters", name),
				})
			}
		}
	}
	return errors
}

// validateSchemaFormats ensures number/integer schemas use appropriate format strings
// and recurses into properties, items, and composition keywords.
func validateSchemaFormats(filePath, loc string, schema *yaml.Node) []ValidationError {
	var errors []ValidationError
	if schema == nil || schema.Kind != yaml.MappingNode {
		return nil
	}

	typ := spec.ScalarValue(spec.GetMappingValue(schema, spec.KeyType))
	format := spec.ScalarValue(spec.GetMappingValue(schema, spec.KeyFormat))

	if format != "" {
		errors = append(errors, validateTypeFormat(filePath, loc, typ, format)...)
	}

	props := spec.GetMappingValue(schema, spec.KeyProperties)
	if props != nil {
		spec.ForEachKV(props, func(name string, prop *yaml.Node) {
			errors = append(errors, validateSchemaFormats(filePath, loc+"/"+spec.KeyProperties+"/"+name, prop)...)
		})
	}

	items := spec.GetMappingValue(schema, spec.KeyItems)
	if items != nil {
		errors = append(errors, validateSchemaFormats(filePath, loc+"/"+spec.KeyItems, items)...)
	}

	for _, keyword := range []string{spec.KeyAllOf, spec.KeyAnyOf, spec.KeyOneOf} {
		arr := spec.GetMappingValue(schema, keyword)
		if arr != nil && arr.Kind == yaml.SequenceNode {
			for i, item := range arr.Content {
				errors = append(errors, validateSchemaFormats(filePath, fmt.Sprintf("%s/%s/%d", loc, keyword, i), item)...)
			}
		}
	}

	return errors
}

func validateTypeFormat(filePath, loc, typ, format string) []ValidationError {
	switch typ {
	case "number":
		if !numberFormatRE.MatchString(format) {
			msg := fmt.Sprintf("schema of type 'number' has invalid format %q (expected float or double)", format)
			if integerFormatRE.MatchString(format) {
				msg = fmt.Sprintf("schema of type 'number' with format %q should be type 'integer'", format)
			}
			return []ValidationError{{File: filePath, Location: loc, Message: msg}}
		}
	case "integer":
		if !integerFormatRE.MatchString(format) {
			msg := fmt.Sprintf("schema of type 'integer' has invalid format %q (expected int32 or int64)", format)
			if numberFormatRE.MatchString(format) {
				msg = fmt.Sprintf("schema of type 'integer' with format %q should be type 'number'", format)
			}
			return []ValidationError{{File: filePath, Location: loc, Message: msg}}
		}
	}
	return nil
}

// lintSchemaRefs cross-checks that all $ref targets in schema and namespace files
// actually exist in the defined schema set.
func (l *Linter) lintSchemaRefs() []ValidationError {
	var errors []ValidationError

	schemasDir := filepath.Join(l.root, spec.DirSchemas)
	nsDir := filepath.Join(l.root, spec.DirNamespaces)

	defined := l.collectDefinedSchemas(schemasDir)

	referenced := make(map[string]bool)
	collectRefs := func(dir string) {
		entries, err := os.ReadDir(dir)
		if err != nil {
			return
		}
		for _, entry := range entries {
			if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".yaml") {
				continue
			}
			doc, err := spec.ReadYAML(filepath.Join(dir, entry.Name()))
			if err != nil {
				continue
			}
			category := strings.TrimSuffix(entry.Name(), ".yaml")
			spec.WalkRefs(doc, func(ref string) string {
				normalized := normalizeSchemaRef(ref, category)
				if normalized != "" {
					referenced[normalized] = true
				}
				return ref
			})
		}
	}

	collectRefs(nsDir)
	collectRefs(schemasDir)

	for ref := range referenced {
		if !defined[ref] {
			errors = append(errors, ValidationError{
				File:    l.root,
				Message: fmt.Sprintf("unresolved schema reference: %s", ref),
			})
		}
	}

	return errors
}

func (l *Linter) collectDefinedSchemas(schemasDir string) map[string]bool {
	defined := make(map[string]bool)
	entries, err := os.ReadDir(schemasDir)
	if err != nil {
		return defined
	}
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".yaml") {
			continue
		}
		category := strings.TrimSuffix(entry.Name(), ".yaml")
		doc, err := spec.ReadYAML(filepath.Join(schemasDir, entry.Name()))
		if err != nil {
			continue
		}
		schemas := spec.GetPath(doc, spec.KeyComponents, spec.KeySchemas)
		if schemas == nil {
			continue
		}
		spec.ForEachKV(schemas, func(name string, _ *yaml.Node) {
			defined[category+":"+name] = true
		})
	}
	return defined
}

// normalizeSchemaRef converts a $ref string to the "category:Name" format used
// for cross-referencing. Returns "" for non-schema refs (e.g. parameter refs).
func normalizeSchemaRef(ref, currentCategory string) string {
	schemasRefPrefix := "#/" + spec.KeyComponents + "/" + spec.KeySchemas + "/"
	schemasFileInfix := ".yaml#/" + spec.KeyComponents + "/" + spec.KeySchemas + "/"

	if strings.HasPrefix(ref, schemasRefPrefix) {
		name := ref[len(schemasRefPrefix):]
		return currentCategory + ":" + name
	}
	relPrefix := "../" + spec.DirSchemas + "/"
	if strings.HasPrefix(ref, relPrefix) || strings.HasPrefix(ref, spec.DirSchemas+"/") {
		ref = strings.TrimPrefix(ref, relPrefix)
		ref = strings.TrimPrefix(ref, spec.DirSchemas+"/")
		ref = strings.Replace(ref, schemasFileInfix, ":", 1)
		return ref
	}
	return ""
}
