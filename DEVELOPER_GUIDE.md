- [Developer Guide](#developer-guide)
  - [Getting Started](#getting-started)
  - [File Structure](#file-structure)
  - [Grouping Operations](#grouping-operations)
  - [Grouping Schemas](#grouping-schemas)
  - [Superseded Operations](#superseded-operations)
  - [Global Parameters](#global-parameters)
  - [OpenAPI Extensions](#openapi-extensions)
  - [Tools](#tools)

# Developer Guide

Welcome to the ```opensearch-api-specification``` developer guide! Glad you want to contribute. Here are the things you need to know while getting started!

## Getting Started

Fork the [opensearch-api-specification](https://github.com/opensearch-project/opensearch-api-specification) repository to your GitHub account and clone it to your local machine. Whenever you're drafting a change, create a new branch for the change on your fork instead of on the upstream repository.

The Specification is written in OpenAPI 3, so understanding the OpenAPI 3 specification is a must. If you are new to OpenAPI, you can start by reading the [OpenAPI 3 Specification](https://swagger.io/specification/).

## File Structure

To make editing the specification easier, we split the OpenAPI spec into multiple files that can be found in the [spec](spec) directory. The file structure is as follows:

```
spec
│
├── namespaces
│   ├── _core.yaml
│   ├── cat.yaml
│   ├── cluster.yaml
│   ├── nodes.yaml
│   └── ...
│
├── schemas
│   ├── _common.yaml
│   ├── _common.mapping.yaml
│   ├── _core._common.yaml
│   ├── _core.bulk.yaml
│   ├── cat._common.yaml
│   ├── cat.aliases.yaml
│   └── ...
│
└── opensearch-openapi.yaml
```

- The API Operations are grouped by namespaces in [spec/namespaces/](spec/namespaces) directory. Each file in this directory represents a namespace and holds all paths and operations of the namespace.
- The data schemas are grouped by categories in [spec/schemas/](spec/schemas) directory. Each file in this directory represents a category.
- The [spec/opensearch-openapi.yaml](spec/opensearch-openapi.yaml) file is the OpenAPI root file that ties everything together.

Every `.yaml` file is a OpenAPI 3 document. This means that you can use any OpenAPI 3 compatible tool to view and edit the files, and IDEs with OpenAPI support will also offer autocomplete and validation in realtime.

## Grouping Operations

Each API action is composed of multiple operations. The `search` action, for example, consists of 4 operations:

- `GET /_search`
- `POST /_search`
- `GET /{index}/_search`
- `POST /{index}/_search`

To group these operations together in the `search` action, we mark them with the `x-operation-group` extension with the same value of `search`. The value of `x-operation-group` is a string that follows the format `[namespace].[action]`, except for the `_core` namespace where the namespace is omitted. For example, the `search` action in the `_core` namespace will have the `x-operation-group` value of `search`, and the `create` action in the `indices` namespace will have the `x-operation-group` value of `indices.create`.

Note that this extension tells the client generators that these operations serve identical purpose and should be grouped together in the same API method. This extension also tells the generators the namespace and the name of the API method. For example, operations with `x-operation-group` value of `indicies.create` will result in `client.indices.create()` method to be generated, while operation group of `search` will result in `client.search()` as it's part of the `_core` namespace.

For this reason, every operation *must* be accompanied by the `x-operation-group` extension, and operations in the same group MUST have identical descriptions, request and response bodies, and query string parameters.

## Grouping Schemas

Schemas are grouped by categories to keep their names short, and aid in client generation (where the schemas are translated into data types/classes, and divided into packages/modules). The schema file names can be in one of the following formats:

- `_common` category holds the common schemas that are used across multiple namespaces and features.
- `_common.<sub_category>` category holds the common schemas of a specific sub_category. (e.g. `_common.mapping`)
- `<namespace>._common` category holds the common schemas of a specific namespace. (e.g. `cat._common`, `_core._common`)
- `<namespace>.<action>` category holds the schemas of a specific sub_category of a namespace. (e.g. `cat.aliases`, `_core.search`)

## Superseded Operations

When an operation is superseded by another operation with **identical functionality**, that is a rename or a change in the URL, it should be listed in [_superseded_operations.yaml](./spec/_superseded_operations.yaml) file. The merger tool will automatically generate the superseded operation in the OpenAPI spec. The superseded operation will have `deprecated: true` and `x-ignorable: true` properties to indicate that it should be ignored by the client generator.

For example, if the `_superseded_operations.yaml` file contains the following entry:
```yaml
/_opendistro/_anomaly_detection/{nodeId}/stats/{stat}:
  superseded_by: /_plugins/_anomaly_detection/{nodeId}/stats/{stat}
  operations:
    - GET
    - POST
```
Then, the merger tool will generate 2 superseded operations: 
- `GET /_opendistro/_anomaly_detection/{nodeId}/stats/{stat}` 
- `POST /_opendistro/_anomaly_detection/{nodeId}/stats/{stat}`

from their respective superseding operations:

- `GET /_plugins/_anomaly_detection/{nodeId}/stats/{stat}`
- `POST /_plugins/_anomaly_detection/{nodeId}/stats/{stat}`

if and only if the superseding operations exist in the spec. A warning will be printed on the console if they do not. 

Note that the path parameter names do not need to match. So, if the actual superseding operations have path of `/_plugins/_anomaly_detection/{node_id}/stats/{stat_id}`, the merger tool will recognize that it is the same as `/_plugins/_anomaly_detection/{nodeId}/stats/{stat}` and generate the superseded operations accordingly with the correct path parameter names.

## Global Parameters
Certain query parameters are global, and they are accepted by every operation. These parameters are listed in the [root file](spec/opensearch-openapi.yaml) under the `parameters` section with `x-global` set to true. The merger tool will automatically add these parameters to all operations.

## OpenAPI Extensions

This repository includes several OpenAPI Specification Extensions to fill in any metadata not natively supported by OpenAPI:

- `x-operation-group`: Used to group operations into API actions.
- `x-version-added`: OpenSearch version when the operation/parameter was added.
- `x-version-deprecated`: OpenSearch version when the operation/parameter was deprecated.
- `x-version-removed`: OpenSearch version when the operation/parameter was removed.
- `x-deprecation-message`: Reason for deprecation and guidance on how to prepare for the next major version.
- `x-ignorable`: Denotes that the operation should be ignored by the client generator. This is used in operation groups where some operations have been replaced by newer ones, but we still keep them in the specs because the server still supports them.
- `x-global`: Denotes that the parameter is a global parameter that is included in every operation. These parameters are listed in the [root file](spec/opensearch-openapi.yaml).
- `x-default`: Contains the default value of a parameter. This is often used to override the default value specified in the schema, or to avoid accidentally changing the default value when updating a shared schema.

## Tools

We authored a number of tools to merge and lint specs that live in [tools](tools). All tools have tests (run with `npm run test`) and a linter (run with `npm run lint`).

### Merger

The spec merger "builds", aka combines all `.yaml` files in a spec folder into a complete OpenAPI spec. A [workflow](./.github/workflows/build.yml) performs this task on the [spec folder](spec) of this repo then publishes the output into [releases](https://github.com/opensearch-project/opensearch-api-specification/releases).

### Linter

The spec linter that validates every `.yaml` file in the `./spec` folder to assure that they follow the guidelines we have set. Check out the [Linter README](tools/README.md#linter) for more information on how to run it locally. Make sure to run the linter before submitting a PR.
