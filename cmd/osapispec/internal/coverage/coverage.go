package coverage

import (
	"encoding/json"
	"flag"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"gopkg.in/yaml.v3"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/spec"
)

var (
	httpMethods = []string{"get", "put", "post", "delete", "options", "head", "patch", "trace"}
	pathParamRE = regexp.MustCompile(`\{[^}]+\}`)
)

// Run is the entry point for the "coverage" subcommand.
func Run(args []string) {
	fs := flag.NewFlagSet("coverage", flag.ExitOnError)
	clusterPath := fs.String("cluster", "build/opensearch-openapi-CLUSTER.yaml", "Path to the cluster's generated spec")
	specPath := fs.String("specification", "build/opensearch-openapi.yaml", "Path to the authored spec")
	output := fs.String("output", "build/coverage.json", "Path to the output file")
	if err := fs.Parse(args); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	result, err := Calculate(*clusterPath, *specPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	if err := writeJSON(*output, result); err != nil {
		fmt.Fprintf(os.Stderr, "error writing output: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Coverage: %d/%d (%.2f%%) endpoints covered\n",
		result.Counts.Covered, result.Counts.Covered+result.Counts.Uncovered, result.Counts.CoveredPct)
}

// Endpoints maps normalized path patterns to their HTTP methods.
type Endpoints map[string][]string

// Counts holds aggregate coverage statistics.
type Counts struct {
	Uncovered               int     `json:"uncovered"`
	UncoveredPct            float64 `json:"uncovered_pct"`
	Covered                 int     `json:"covered"`
	CoveredPct              float64 `json:"covered_pct"`
	SpecifiedButNotProvided int     `json:"specified_but_not_provided"`
}

// Result contains the full coverage analysis output.
type Result struct {
	Description struct {
		Uncovered               string `json:"uncovered"`
		Covered                 string `json:"covered"`
		SpecifiedButNotProvided string `json:"specified_but_not_provided"`
	} `json:"$description"`
	Counts    Counts `json:"counts"`
	Endpoints struct {
		Uncovered               Endpoints `json:"uncovered"`
		Covered                 Endpoints `json:"covered"`
		SpecifiedButNotProvided Endpoints `json:"specified_but_not_provided"`
	} `json:"endpoints"`
}

// Calculate computes endpoint coverage between a cluster spec and the authored spec.
func Calculate(clusterPath, specPath string) (*Result, error) {
	clusterDoc, err := spec.ReadYAML(clusterPath)
	if err != nil {
		return nil, fmt.Errorf("reading cluster spec: %w", err)
	}
	inputDoc, err := spec.ReadYAML(specPath)
	if err != nil {
		return nil, fmt.Errorf("reading specification: %w", err)
	}

	uncovered := collectEndpoints(clusterDoc)
	specifiedButNotProvided := collectEndpoints(inputDoc)
	covered := make(Endpoints)

	for path, methods := range uncovered {
		specMethods, ok := specifiedButNotProvided[path]
		if !ok {
			continue
		}

		var remainUncovered []string
		for _, m := range methods {
			if removeMethod(&specMethods, m) {
				covered[path] = append(covered[path], m)
			} else {
				remainUncovered = append(remainUncovered, m)
			}
		}
		uncovered[path] = remainUncovered
		specifiedButNotProvided[path] = specMethods
	}

	prune(uncovered)
	prune(covered)
	prune(specifiedButNotProvided)

	uncoveredCount := countMethods(uncovered)
	coveredCount := countMethods(covered)
	total := uncoveredCount + coveredCount

	var uncoveredPct, coveredPct float64
	if total > 0 {
		uncoveredPct = math.Round(float64(uncoveredCount)/float64(total)*10000) / 100
		coveredPct = math.Round(float64(coveredCount)/float64(total)*10000) / 100
	}

	result := &Result{
		Counts: Counts{
			Uncovered:               uncoveredCount,
			UncoveredPct:            uncoveredPct,
			Covered:                 coveredCount,
			CoveredPct:              coveredPct,
			SpecifiedButNotProvided: countMethods(specifiedButNotProvided),
		},
	}
	result.Description.Uncovered = "Endpoints provided by the OpenSearch cluster but DO NOT exist in the specification"
	result.Description.Covered = "Endpoints both provided by the OpenSearch cluster and exist in the specification"
	result.Description.SpecifiedButNotProvided = "Endpoints NOT provided by the OpenSearch cluster but exist in the specification"
	result.Endpoints.Uncovered = uncovered
	result.Endpoints.Covered = covered
	result.Endpoints.SpecifiedButNotProvided = specifiedButNotProvided

	return result, nil
}

func collectEndpoints(doc *yaml.Node) Endpoints {
	endpoints := make(Endpoints)
	paths := spec.GetPath(doc, spec.KeyPaths)
	if paths == nil {
		return endpoints
	}

	spec.ForEachKV(paths, func(path string, pathItem *yaml.Node) {
		normalized := pathParamRE.ReplaceAllString(path, "{}")
		var methods []string
		spec.ForEachKV(pathItem, func(key string, _ *yaml.Node) {
			for _, m := range httpMethods {
				if strings.EqualFold(key, m) {
					methods = append(methods, m)
				}
			}
		})
		if len(methods) > 0 {
			endpoints[normalized] = append(endpoints[normalized], methods...)
		}
	})

	return endpoints
}

func removeMethod(methods *[]string, method string) bool {
	for i, m := range *methods {
		if m == method {
			*methods = append((*methods)[:i], (*methods)[i+1:]...)
			return true
		}
	}
	return false
}

func prune(endpoints Endpoints) {
	for k, v := range endpoints {
		if len(v) == 0 {
			delete(endpoints, k)
		}
	}
}

func countMethods(endpoints Endpoints) int {
	n := 0
	for _, methods := range endpoints {
		n += len(methods)
	}
	return n
}

func writeJSON(path string, v any) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	data, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, append(data, '\n'), 0o600)
}
