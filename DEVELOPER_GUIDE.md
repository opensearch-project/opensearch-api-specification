- [Developer Guide](#developer-guide)
  - [Getting Started](#getting-started)
  - [File Structure](#file-structure)
  - [Grouping Operations](#grouping-operations)
  - [Grouping Schemas](#grouping-schemas)
  - [OpenAPI Extensions](#openapi-extensions)
  - [Linting](#linting)

# Developer Guide
Welcome to the ```opensearch-api-specification``` developer guide! Glad you want to contribute. Here are the things you need to know while getting started!

## Getting Started

Fork [opensearch-api-specification](https://github.com/opensearch-project/opensearch-api-specification) repository to your GitHub account and clone it to your local machine.  Whenever you're drafting a change, create a new branch for the change on your fork instead of on the upstream repository.

The Specification is written in OpenAPI 3, so understanding the OpenAPI 3 specification is a must. If you are new to OpenAPI, you can start by reading the [OpenAPI 3 Specification](https://swagger.io/specification/).

## File Structure
To make editing the specification easier, we split the OpenAPI spec into multiple files that can be found in the `spec` directory. The file structure is as follows:
- The API Operations are grouped by namespaces in `spec/namespaces` directory. Each `yaml` file in this directory represents a namespace and holds all paths and operations of the namespace.
- The data schemas are grouped by categories in `spec/schemas` directory. Each `yaml` file in this directory represents a category.
- The `OpenSearch.openapi.yaml` file is the OpenAPI root file that ties everything together.

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
└── OpenSearch.openapi.yaml
```
Every `yaml` file is a valid OpenAPI 3 document. This means that you can use any OpenAPI 3 compatible tool to view and edit the files, and IDEs with OpenAPI support will provide you with autocompletion and validation in real-time.

## Grouping Operations

Each API action is composed of multiple operations. The `search` action, for example, is consisted of 4 operations:
- `GET /_search`
- `POST /_search`
- `GET /{index}/_search`
- `POST /{index}/_search`

To group these operations together in the `search` action, we mark them with the `x-operation-group` extension with the same value of `search`. The value of `x-operation-group` is a string that follows the format `[namespace].[action]`, except for the `_core` namespace where the namespace is omitted. For example, the `search` action in the `_core` namespace will have the `x-operation-group` value of `search`, and the `create` action in the `indices` namespace will have the `x-operation-group` value of `indices.create`.

Note that this extension tells the client generators that these operations serve identical purpose and should be grouped together in the same API method. This extension also tells the generators the namespace and the name of the API method. For example, operations with `x-operation-group` value of `indicies.create` will result in `client.indices.create()` method to be generated, while operation group of `search` will result in `client.search()` as it's part of the `_core` namespace.

For this reason, every operation MUST be accompanied by the `x-operation-group` extension, and operations in the same group MUST have identical descriptions, request and response bodies, and querystring parameters.

## Grouping Schemas

Schemas are  grouped by categories to keep their names short and aid in client generation:
- `_common` category holds the common schemas that are used across multiple namespaces and features.
- `_common.<sub_category>` category holds the common schemas of a specific sub_category. (e.g. `_common.mapping`)
- `<namespace>._common` category holds the common schemas of a specific namespace. (e.g. `cat._common`, `_core._common`)
- `<namespace>.<action>` category holds the schemas of a specific sub_category of a namespace. (e.g. `cat.aliases`, `_core.search`)

## OpenAPI Extensions

This repository includes several penAPI Specification Extensions to fill in any metadata not directly supported OpenAPI:
- `x-operation-group`: Used to group operations into API actions.
- `x-version-added`: OpenSearch version when the operation/parameter was added.
- `x-version-deprecated`: OpenSearch version when the operation/parameter was deprecated.
- `x-version-removed`: OpenSearch version when the operation/parameter was removed.
- `x-deprecation-message`: Reason for deprecation and guidance on how to prepare for the next major version.
- `x-ignorable`: Denotes that the operation should be ignored by the client generator. This is used in operation groups where some operations have been replaced by newer ones, but we still keep them in the specs because the server still supports them.

## Linting
[WORK IN PROGRESS]
We are working on a linter that will validate every `yaml` file in the `./spec` folder to assure that they follow the guidelines we have set. The linter will be run on every pull request to make sure that the changes are in line with the guidelines.
