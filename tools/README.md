# OpenSearch OpenAPI Tools

This folder contains tools for the repo:

- [Merger](./merger): merges multiple OpenAPI files into one
- [Linter](./linter): validates files in the spec folder

## Setup

1. Install [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
2. Run `npm install` in the `tools` folder

## Merger

The merger tool merges the multi-file OpenSearch spec into a single file for programmatic use. It takes 2 parameters:

- the path to the root folder of the multi-file spec
- the path to the output file

Example:

```bash
mkdir -p ../build
export ROOT_PATH=../spec/opensearch-openapi.yaml
export OUTPUT_PATH=../build/opensearch-openapi.yaml
npm run merge -- $ROOT_PATH $OUTPUT_PATH
```

As a shortcut, if those parameters are not provided, the tool will use the default values:
- `../spec/opensearch-openapi.yaml` as the root path (i.e. the root file of the repo's [spec folder](../spec))
- `../opensearch-openapi.yaml` as the output path

```bash
npm run merge
```

## Spec Linter

The linter tool validates the OpenSearch spec files in the `spec` folder:

```bash
npm run lint:spec
```

It will print out all the errors and warnings in the spec files.