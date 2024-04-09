# OpenSearch OpenAPI Tools
This folder contains tools for the repo:
- Merger: Merges multiple OpenAPI files into one
- Linter: Validates files in the spec folder

## Setup
1. Install [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
2. Run `npm install` in the `tools` folder

## Merger
The merger tool merges the multi-file OpenSearch spec into a single file for programmatic use. It takes 2 values as input:
- The path to the root folder of the multi-file spec
- The path to the output file
Example:
```bash
npm run merge -- ../spec ../build/opensearch-openapi.latest.yaml
```

## Linter
The linter tool validates the OpenSearch spec files in the `spec` folder:
```bash
npm run lint
```
It will print out all the errors and warnings in the spec files. This tool in still in development, and it will be integrated into the CI/CD pipeline and run automatically with every PR.
```