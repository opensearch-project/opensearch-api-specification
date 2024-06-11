<!-- TOC -->
- [Developer Guide](#developer-guide)
  - [Getting Started](#getting-started)
  - [Specification](#specification)
    - [File Structure](#file-structure)
    - [Grouping Operations](#grouping-operations)
    - [Grouping Schemas](#grouping-schemas)
    - [Superseded Operations](#superseded-operations)
    - [Global Parameters](#global-parameters)
    - [OpenAPI Extensions](#openapi-extensions)
  - [Writing Spec Tests](#writing-spec-tests)
    - [Test Stories](#test-stories)
    - [Organizing Tests](#organizing-tests)
    - [Running Spec Tests Locally](#running-spec-tests-locally)
  - [Tools](#tools)
    - [Setup](#setup)
    - [Spec Merger](#spec-merger)
      - [Arguments](#arguments)
      - [Example](#example)
    - [Spec Linter](#spec-linter)
      - [Arguments](#arguments-1)
      - [Example](#example-1)
    - [Dump Cluster Spec](#dump-cluster-spec)
      - [Arguments](#arguments-2)
      - [Example](#example-2)
    - [Coverage](#coverage)
      - [Arguments](#arguments-3)
      - [Example](#example-3)
    - [Testing](#testing)
      - [Tests](#tests)
      - [Lints](#lints)
  - [Workflows](#workflows)
    - [Analyze PR Changes](#analyze-pr-changes)
    - [Build](#build)
    - [Deploy GitHub Pages](#deploy-github-pages)
    - [Comment on PR](#comment-on-pr)
    - [Test Tools (Unit)](#test-tools-unit)
    - [Test Tools (Integration)](#test-tools-integration)
    - [Validate Spec](#validate-spec)
<!-- TOC -->

# Developer Guide

Welcome to the `opensearch-api-specification` developer guide! Glad you want to contribute. Here are the things you need to know while getting started!

## Getting Started

Fork the [opensearch-api-specification](https://github.com/opensearch-project/opensearch-api-specification) repository to your GitHub account and clone it to your local machine. Whenever you're drafting a change, create a new branch for the change on your fork instead of on the upstream repository.

## Specification

The Specification is written in OpenAPI 3, so understanding the OpenAPI 3 specification is a must. If you are new to OpenAPI, you can start by reading the [OpenAPI 3 Specification](https://swagger.io/specification/).

### File Structure

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
├── _info.yaml
├── _global_parameters.yaml
└── _superseded_operations.yaml
```

- The API Operations are grouped by namespaces in [spec/namespaces/](spec/namespaces) directory. Each file in this directory represents a namespace and holds all paths and operations of the namespace.
- The data schemas are grouped by categories in [spec/schemas/](spec/schemas) directory. Each file in this directory represents a category.

Every `.yaml` file in the namespaces and schemas folders is a OpenAPI 3 document. This means that you can use any OpenAPI 3 compatible tool to view and edit the files, and IDEs with OpenAPI support will also offer autocomplete and validation in realtime.

### Grouping Operations

Each API action is composed of multiple operations. The `search` action, for example, consists of 4 operations:

- `GET /_search`
- `POST /_search`
- `GET /{index}/_search`
- `POST /{index}/_search`

To group these operations together in the `search` action, we mark them with the `x-operation-group` extension with the same value of `search`. The value of `x-operation-group` is a string that follows the format `[namespace].[action]`, except for the `_core` namespace where the namespace is omitted. For example, the `search` action in the `_core` namespace will have the `x-operation-group` value of `search`, and the `create` action in the `indices` namespace will have the `x-operation-group` value of `indices.create`.

Note that this extension tells the client generators that these operations serve identical purpose and should be grouped together in the same API method. This extension also tells the generators the namespace and the name of the API method. For example, operations with `x-operation-group` value of `indicies.create` will result in `client.indices.create()` method to be generated, while operation group of `search` will result in `client.search()` as it's part of the `_core` namespace.

For this reason, every operation *must* be accompanied by the `x-operation-group` extension, and operations in the same group MUST have identical descriptions, request and response bodies, and query string parameters.

### Grouping Schemas

Schemas are grouped by categories to keep their names short, and aid in client generation (where the schemas are translated into data types/classes, and divided into packages/modules). The schema file names can be in one of the following formats:

- `_common` category holds the common schemas that are used across multiple namespaces and features.
- `_common.<sub_category>` category holds the common schemas of a specific sub_category. (e.g. `_common.mapping`)
- `<namespace>._common` category holds the common schemas of a specific namespace. (e.g. `cat._common`, `_core._common`)
- `<namespace>.<action>` category holds the schemas of a specific sub_category of a namespace. (e.g. `cat.aliases`, `_core.search`)

### Superseded Operations

When an operation is superseded by another operation with **identical functionality**, that is a rename or a change in the URL, it should be listed in [_superseded_operations.yaml](spec/_superseded_operations.yaml) file. The merger tool will automatically generate the superseded operation in the OpenAPI spec. The superseded operation will have `deprecated: true` and `x-ignorable: true` properties to indicate that it should be ignored by the client generator.

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

### Global Parameters

Certain query parameters are global, and they are accepted by every operation. These parameters are listed in the [spec/_global_parameters.yaml](spec/_global_parameters.yaml). The merger tool will automatically add these parameters to all operations.

### OpenAPI Extensions

This repository includes several OpenAPI Specification Extensions to fill in any metadata not natively supported by OpenAPI:

- `x-operation-group`: Used to group operations into API actions.
- `x-version-added`: OpenSearch version when the operation/parameter was added.
- `x-version-deprecated`: OpenSearch version when the operation/parameter was deprecated.
- `x-version-removed`: OpenSearch version when the operation/parameter was removed.
- `x-deprecation-message`: Reason for deprecation and guidance on how to prepare for the next major version.
- `x-ignorable`: Denotes that the operation should be ignored by the client generator. This is used in operation groups where some operations have been replaced by newer ones, but we still keep them in the specs because the server still supports them.
- `x-global`: Denotes that the parameter is a global parameter that is included in every operation. These parameters are listed in the [spec/_global_parameters.yaml](spec/_global_parameters.yaml).
- `x-default`: Contains the default value of a parameter. This is often used to override the default value specified in the schema, or to avoid accidentally changing the default value when updating a shared schema.

## Writing Spec Tests

To assure the correctness of the spec, you must add tests for the spec in the [tests/](tests) directory.

### Test Stories

Each yaml file in the tests directory represents a test story that tests a collection of related operations.

A test story has 3 main components:
- prologues: These are the operations that are executed before the test story is run. They are used to set up the environment for the test story.
- chapters: These are the operations that are being tested.
- epilogues: These are the operations that are executed after the test story is run. They are used to clean up the environment after the test story.

Below is the simplified version of the test story that tests the [index operations](tests/indices/index.yaml):
```yaml
$schema: ../json_schemas/test_story.schema.yaml # The schema of the test story. Include this line so that your editor can validate the test story on the fly.

skip: false # Skip this test story if set to true.
description: This story tests all endpoints relevant the lifecycle of an index, from creation to deletion.

prologues: [] # No prologues are needed for this story.

epilogues: # Clean up the environment by assuring that the `books` index is deleted afterward.
  - path: /books
    method: DELETE
    status: [200, 404] # The index may not exist, so we accept 404 as a valid response. Default to [200, 201] if not specified.
    
chapters:
  - synopsis: Create an index named `books` with mappings and settings.
    path: /{index} # The test will fail if "PUT /{index}" operation is not found in the spec.
    method: PUT
    parameters: # All parameters are validated against their schemas in the spec
      index: books
    request_body: # The request body is validated against the schema of the requestBody in the spec
      payload:
        mappings:
          properties:
            name:
              type: keyword
            age:
              type: integer
        settings:
          number_of_shards: 5
          number_of_replicas: 2
    response: # The response body is validated against the schema of the corresponding response in the spec
      status: 200 # This is the expected status code of the response. Any other status code will fail the test.

  - synopsis: Retrieve the mappings and settings of the `books` index.
    path: /{index}
    method: GET
    parameters:
      index: books
      flat_settings: true
      
  - synopsis: Delete the `books` index.
    path: /{index}
    method: DELETE
    parameters:
      index: books
```

Check the [test_story JSON Schema](json_schemas/test_story.schema.yaml) for the complete structure of a test story.

### Organizing Tests

Tests are organized in folders that match [namespaces](spec/namespaces). For example, tests for APIs defined in [spec/namespaces/indices.yaml](spec/namespaces/indices.yaml) can be found in [tests/indices/index.yaml](tests/indices/index.yaml) (for `/{index}`), and [tests/indices/_doc.yaml](tests/indices/_doc.yaml) (for `/{index}/_doc`).

### Running Spec Tests Locally

Set up an OpenSearch cluster with Docker using the default OPENSEARCH_PASSWORD (Recommended):
```bash
cd .github/opensearch-cluster
docker-compose up -d
```

Run the tests:
```bash
npm run test:spec
```

If you opt to use a different password, you can set the `OPENSEARCH_PASSWORD` environment variable to the desired password before running `docker-compose up` and every time you run the tests:
```bash
export OPENSEARCH_PASSWORD='yourOwnPassword@2021'
```

Check the [test_story JSON Schema](json_schemas/test_story.schema.yaml) for the complete structure of a test story.


## Tools

A number of [tools](tools) have been authored using TypeScript to aid in the development of the specification. These largely center around linting and merging the multi-file spec layout.

### Setup

To be able to use or develop the tools, some setup is required:
1. Install [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs).
2. Run `npm install` from the repository's root.

### [Spec Merger](tools/src/merger)

```bash
npm run merge -- --help
```

The merger tool merges the multi-file OpenSearch spec into a single file for programmatic use.

#### Arguments

- `--source <path>`: The path to the root folder of the multi-file spec, defaults to `<repository-root>/spec`.
- `--output <path>`: The path to write the final merged spec to, defaults to `<repository-root>/build/opensearch-openapi.yaml`.

#### Example

We can take advantage of the default values and simply merge the specification via:
```bash
npm run merge
```

### [Spec Linter](tools/src/linter)

```bash
npm run lint:spec -- --help
```

The linter tool validates the OpenSearch multi-file spec, and will print out all the errors and warnings in it.

#### Arguments

- `--source <path>`: The path to the root folder of the multi-file spec, defaults to `<repository-root>/spec`.

#### Example

We can take advantage of the default values and simply lint the specification via:
```bash
npm run lint:spec
```

### [Dump Cluster Spec](tools/src/dump-cluster-spec)

```bash
npm run dump-cluster-spec -- --help
```

The dump-cluster-spec tool connects to an OpenSearch cluster which has the [opensearch-api plugin](https://github.com/dblock/opensearch-api) installed and dumps the skeleton OpenAPI specification it provides to a file.

#### Arguments

- `--opensearch-url <url>`: The URL at which the cluster is accessible, defaults to `https://localhost:9200`.
- `--opensearch-insecure`: Disable SSL/TLS certificate verification, defaults to performing verification.
- `--opensearch-username <username>`: The username to authenticate with the cluster, defaults to `admin`, only used when `--opensearch-password` is set.
- `--opensearch-password <password>`: The password to authenticate with the cluster, also settable via the `OPENSEARCH_PASSWORD` environment variable.
- `--output <path>`: The path to write the dumped spec to, defaults to `<repository-root>/build/opensearch-openapi-CLUSTER.yaml`.

#### Example

You can use this repo's [docker image which includes the opensearch-api plugin](coverage/Dockerfile) to spin up a local development cluster with a self-signed certificate (e.g. `https://localhost:9200`) and security enabled, to then dump the skeleton specification:
```bash
OPENSEARCH_PASSWORD='My$3cureP@$$w0rd'

docker build ./coverage --tag opensearch-with-api-plugin
          
docker run \
    --name opensearch \
    --rm -d \
    -p 9200:9200 -p 9600:9600 \
    -e "discovery.type=single-node" \
    -e OPENSEARCH_INITIAL_ADMIN_PASSWORD="$OPENSEARCH_PASSWORD" \
    opensearch-with-api-plugin

OPENSEARCH_PASSWORD="${OPENSEARCH_PASSWORD}" npm run dump-cluster-spec -- --opensearch-insecure

docker stop opensearch
```

### [Coverage](tools/src/coverage)

```bash
npm run coverage:spec -- --help
```

The coverage tool determines which APIs from the OpenSearch cluster's reference skeleton specification (dumped by the [dump-cluster-spec tool](#dump-cluster-spec)) are covered by this specification (as built by the [merger tool](#merger)).

#### Arguments

- `--cluster <path>`: The path to the cluster's reference skeleton specification, as dumped by [dump-cluster-spec](#dump-cluster-spec), defaults to `<repository-root>/build/opensearch-openapi-CLUSTER.yaml`.
- `--specification <path>`: The path to the merged specification, as built by [merger](#merger), defaults to `<repository-root>/build/opensearch-openapi.yaml`.
- `--output <path>`: The path to write the coverage data to, defaults to `<repository-root>/build/coverage.json`.

#### Example

Assuming you've already followed the previous examples to build the merged specification with the [merger](#example) and dump the cluster's specification with [dump-cluster-spec](#example-2), you can then calculate the API coverage:
```bash
npm run coverage:spec
```
The output file `build/coverage.json` will now contain data of like below:
```json
{
  "$description": {
    "uncovered": "Endpoints provided by the OpenSearch cluster but DO NOT exist in the specification",
    "covered": "Endpoints both provided by the OpenSearch cluster and exist in the specification",
    "specified_but_not_provided": "Endpoints NOT provided by the OpenSearch cluster but exist in the specification"
  },
  "counts": {
    "uncovered": 552,
    "uncovered_pct": 54.06,
    "covered": 469,
    "covered_pct": 45.94,
    "specified_but_not_provided": 23
  },
  "endpoints": {
    "uncovered": {
      "/_alias": [
        "put"
      ],
      ...
    },
    "covered": {
      "/_mapping": [
        "get"
      ],
      ...
    },
    "specified_but_not_provided": {
      "/_plugins/_knn/{}/stats": [
        "get"
      ],
      ...
    }
  }
}
```

### Testing

#### Tests

All tools should have tests added in [tools/tests](tools/tests), tests are implemented using [Jest](https://jestjs.io/). They can be run via:
```bash
npm run test
```

Specify the test path to run tests for one of the tools:
```bash
npm run jest -- tools/tests/linter/lint.test.ts 
```

The test suite contains unit tests and integration tests. Integration tests, such as [these](tools/tests/tester/integ/), require a local instance of OpenSearch and are placed into a folder named `integ`. Unit tests are run in parallel and integration tests are run sequentially using `--runInBand`. You can run unit tests with `npm run test:unit` separately from integration tests with `npm run test:integ`.

#### Lints

All TypeScript code and YAML files are linted using [ESLint](https://eslint.org/), [typescript-eslint](https://typescript-eslint.io/), and [eslint-plugin-yml](https://ota-meshi.github.io/eslint-plugin-yml/). Linting can be run via:
```bash
npm run lint
```

If a lint is unavoidable it should only be disabled on a case-by-case basis (e.g. `// eslint-disable-next-line @typescript-eslint/dot-notation`) and ideally be justified with an accompanying comment or at least in PR review.

ESLint's auto-fixes can be applied by running:
```bash
npm run lint--fix
```

## Workflows

### [Analyze PR Changes](.github/workflows/analyze-pr-changes.yml)

This workflow runs on all pull requests to analyze any potential changes to the specification. It uses the [coverage](#coverage) tool and [openapi-changes](https://pb33f.io/openapi-changes/) to calculate coverage metrics and provide a report on the changes when comparing with the commit at which the PR was branched off.

### [Build](.github/workflows/build.yml)

This workflow runs on pushes to the `main` branch and will [merge](#merger) the specification and publish it to [GitHub Releases](https://github.com/opensearch-project/opensearch-api-specification/releases).

### [Deploy GitHub Pages](.github/workflows/deploy-gh-pages.yml)

This workflow performs a [Jekyll](https://jekyllrb.com/) build of the `main` branch to generate the [Swagger docs](index.html) and publish it to [GitHub Pages](https://opensearch-project.github.io/opensearch-api-specification/).

### [Comment on PR](.github/workflows/pr-comment.yml)

This workflow is triggered by the completion of the workflows such as [Analyze PR Changes](#analyze-pr-changes) and downloading a JSON payload artifact which it uses to invoke a template from [.github/pr-comment-templates](.github/pr-comment-templates) to render a comment which is placed on the original triggering PR.

### [Test Tools (Unit)](.github/workflows/test-tools-unit.yml)

This workflow runs on PRs to invoke the [tools' unit tests](tools/tests), upload test coverage to CodeCov, and run [TypeScript linting](#lints) to ensure there are no breakages in behavior or departures from the desired code style and cleanliness.

### [Test Tools (Integration)](.github/workflows/test-tools-integ.yml)

This workflow runs on PRs to invoke the [tools' integration tests](tools/tests) that require a running instance of OpenSearch to ensure there are no breakages in behavior.

### [Validate Spec](.github/workflows/validate-spec.yml)

This workflow runs on PRs to invoke the [spec linter](#spec-linter) and ensure the multi-file spec is correct and follows the design guidelines.