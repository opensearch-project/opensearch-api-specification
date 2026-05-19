package main

import (
	"fmt"
	"os"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/coverage"
	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/dump"
	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/linter"
	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/merger"
	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/tester"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, `usage: osapispec <command> [flags]

Commands:
  merge    Merge spec fragments into a single OpenAPI document
  lint     Validate spec structure and naming conventions
  test     Run spec test stories against a live cluster
  coverage Calculate spec endpoint coverage
  dump     Dump cluster API spec from a live cluster`)
		os.Exit(1)
	}

	switch os.Args[1] {
	case "merge":
		merger.Run(os.Args[2:])
	case "lint":
		linter.Run(os.Args[2:])
	case "test":
		tester.Run(os.Args[2:])
	case "coverage":
		coverage.Run(os.Args[2:])
	case "dump":
		dump.Run(os.Args[2:])
	default:
		fmt.Fprintf(os.Stderr, "unknown command: %s\n", os.Args[1])
		os.Exit(1)
	}
}
