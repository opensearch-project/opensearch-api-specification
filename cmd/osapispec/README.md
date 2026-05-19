# osapispec

`osapispec` is a CLI tool for managing the OpenSearch API specification. It
merges fragmented YAML spec files into a single OpenAPI 3.1 document, validates
spec structure and naming conventions, runs integration test stories against a
live cluster, computes endpoint coverage, and dumps a cluster's runtime API spec.

## Building

```sh
go build -o osapispec ./cmd/osapispec
```

## Commands

### merge

Merge spec fragments into a single OpenAPI document.

```sh
osapispec merge -spec spec -output build/opensearch-openapi.yaml
```

### lint

Validate spec structure and naming conventions.

```sh
osapispec lint -spec spec
```

### test

Run YAML test stories against a live OpenSearch cluster.

```sh
osapispec test \
  -url https://localhost:9200 \
  -username admin \
  -password secret \
  -insecure \
  -tests tests/default
```

### coverage

Calculate endpoint coverage between a cluster's runtime spec and the authored
spec.

```sh
osapispec coverage \
  -cluster build/opensearch-openapi-CLUSTER.yaml \
  -specification build/opensearch-openapi.yaml \
  -output build/coverage.json
```

### dump

Dump a live cluster's API spec to a YAML file.

```sh
osapispec dump \
  -url https://localhost:9200 \
  -username admin \
  -password secret \
  -insecure \
  -output build/opensearch-openapi-CLUSTER.yaml
```

## Dependencies

- Go 1.25+
- `gopkg.in/yaml.v3` — YAML node-level parsing and serialization
- `golang.org/x/text/collate` — Unicode Default Collation for deterministic key ordering
- `github.com/stretchr/testify` — test assertions (test-only)
