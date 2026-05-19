package dump

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"time"

	"gopkg.in/yaml.v3"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/merger"
	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/osclient"
)

// Run is the entry point for the "dump" subcommand.
func Run(args []string) {
	fs := flag.NewFlagSet("dump", flag.ExitOnError)
	url := fs.String("url", "https://localhost:9200", "OpenSearch cluster URL")
	username := fs.String("username", "admin", "Username for authentication")
	password := fs.String("password", "", "Password for authentication")
	insecure := fs.Bool("insecure", false, "Disable TLS certificate verification")
	output := fs.String("output", "build/opensearch-openapi-CLUSTER.yaml", "Output file path")
	if err := fs.Parse(args); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	client, err := osclient.New(osclient.Options{
		URL:      *url,
		Username: *username,
		Password: *password,
		Insecure: *insecure,
	})
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	info, err := client.WaitUntilAvailable(120 * time.Second)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Connected to %s (OpenSearch %s)\n", info.Name, info.Version.Number)

	data, err := client.Get("/_plugins/api")
	if err != nil {
		fmt.Fprintf(os.Stderr, "error fetching cluster spec: %v\n", err)
		os.Exit(1)
	}

	var raw any
	if err := json.Unmarshal(data, &raw); err != nil {
		fmt.Fprintf(os.Stderr, "error parsing response: %v\n", err)
		os.Exit(1)
	}

	var doc yaml.Node
	yamlBytes, err := yaml.Marshal(raw)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error converting to YAML: %v\n", err)
		os.Exit(1)
	}
	if err := yaml.Unmarshal(yamlBytes, &doc); err != nil {
		fmt.Fprintf(os.Stderr, "error parsing YAML: %v\n", err)
		os.Exit(1)
	}

	if err := merger.WriteYAML(*output, &doc); err != nil {
		fmt.Fprintf(os.Stderr, "error writing output: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Wrote cluster spec to %s\n", *output)
}
