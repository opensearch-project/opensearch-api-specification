# OpenSearch OpenAPI Tools

This folder contains tools for the repo:

- [Merger](./merger): merges multiple OpenAPI files into one
- [Linter](./linter): validates files in the spec folder

## Setup

1. Install [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
2. Run `npm install`.

## Merger

The merger tool merges the multi-file OpenSearch spec into a single file for programmatic use. 

It requires a path to the root folder of the multi-file spec (`--source`) and a path to the output file (`--output`).

Example:

```bash
mkdir -p ./build
npm run merge -- --source ./spec --output ./build/opensearch-openapi.yaml
```

As a shortcut, if those parameters are not provided, the tool will use the default values:

- `../spec` as the root path (i.e. the repo's [spec folder](../spec))
- `./build/opensearch-openapi.yaml` as the output path

```bash
npm run merge
```

Run `npm run merge -- --help` for all options.

## Spec Linter

The linter tool validates the OpenSearch multi-file spec, and will print out all the errors and warnings in it.

It requires a path to the root folder of the multi-file spec (`--source`).

```bash
npm run lint:spec -- --source ./spec
```

Run `npm run lint:spec -- --help` for all options.
