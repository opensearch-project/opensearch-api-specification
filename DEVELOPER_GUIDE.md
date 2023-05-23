- [Developer Guide](#developer-guide)
  - [Getting Started](#getting-started)
    - [Build](#build)
    - [Formatting](#formatting)
    - [Use an IDE](#use-an-ide)
      - [Visual Studio Code](#visual-studio-code)
      - [IntelliJ](#intellij)
  - [File Structure](#file-structure)
  - [Defining an API Action](#defining-an-api-action)
    - [Defining operations](#defining-operations)
    - [Defining input and output structures](#defining-input-and-output-structures)
  - [Defining Common Parameters](#defining-common-parameters)
  - [Smithy Traits](#smithy-traits)
    - [OpenAPI Vendor Extensions Trait](#openapi-vendor-extensions-trait)
  - [Adding a test-case for API definition](#adding-a-test-case-for-api-definition)
    - [File Structure for Test-folder](#file-structure-for-test-folder)
    - [Defining test-case for API model](#defining-test-case-for-api-model)
  - [Local testing](#local-testing)
    - [Pre-requisite](#pre-requisite)
    - [Testing model API](#testing-model-api)

# Developer Guide
Welcome to the ```opensearch-api-specification``` developer guide! Glad you want to contribute. Here are the things you need to know while getting started!

## Getting Started

Fork [opensearch-api-specification](https://github.com/opensearch-project/opensearch-api-specification) repository to your GitHub account and clone it to your local machine.  Whenever you're drafting a change, create a new branch for the change on your fork instead of on the upstream repository.

### Build
You will also need Java Development Kit (JDK) 17 or later to build the project.
In your terminal, run the following command to build the project:
```
./gradlew build
```
This command generates API specs for Smithy and also converts them to OpenAPI specs. The specs can be found at:
- Smithy specs: `build/smithyprojections/opensearch-api-specification/full/model`
- OpenAPI specs: `build/smithyprojections/opensearch-api-specification/full/openapi`

### Formatting
To format the Smithy model files, use
```
./gradlew spotlessCheck
./gradlew spotlessApply
```

### Use an IDE
Popular IDEs for Smithy models include Visual Studio Code and IntelliJ, and they both have plugins that improve the editing experience for this project.
#### Visual Studio Code
- [Smithy Plugin](https://github.com/awslabs/smithy-vscode)
- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)

#### IntelliJ
- [Smithy Plugin](https://plugins.jetbrains.com/plugin/18717-smithy)
- [OpenAPI Specifications](https://plugins.jetbrains.com/plugin/14394-openapi-specifications)

## File Structure
The OpenSearch API is composed of over 300 operations. These operations are grouped into API actions based on the functionality they provide. Each API action is later translated to an API method in each OpenSearch client. For example:
- The `cat.health` action will turn into `client.cat.health()`
- While the `index` action will turn into `client.index()`

This grouping influences the file structure of the Smithy models:
- Operations of `cat.health` action will be defined in `model/cat/health` folder
- Operations of `index` action will be defined in `model/_global/index` folder

Each action folder contains 2 files
- `operations.smithy` defines all the operations of that action.
- `structures.smithy` defines the input and output structures of said operations.

The path and querystring parameters are often reused across multiple operations regardless of the action they belong to. These parameters are defined in the root folder, `model/`, and grouped by data-type in files of `common_<data_type>.smithy` format.

Overall, the file structure of the Smithy models looks like this:
```
model
├── _global
│   ├── index
│   │   ├── operations.smithy
│   │   └── structures.smithy
│   └── search
│       ├── operations.smithy
│       └── structures.smithy
├── cat
│   └── health
│       ├── operations.smithy
│       └── structures.smithy
│
├── common_strings.smithy
└── common_enums.smithy
```

## Defining an API Action

As mentioned in the previous section, each API action is composed of multiple operations that are defined in the same `operations.smithy` file. The `search` action, for example, is consisted of 4 operations:
- `GET /_search`
- `POST /_search`
- `GET /{index}/_search`
- `POST /{index}/_search`

### Defining operations

We name each operation using the following format `[ActionName]_[HttpVerb]_[PathParameters]`
- ActionName: The name of the action. CamelCase and without the `.` character. E.g. `search -> Search`, `cat.health -> CatHealth`.
- HttpVerb: The HTTP verb of the operation. E.g. `Get`, `Post`, `Put`, `Delete`. In actions where all operations share the same HTTP verb, we omit the verb from the operation name.
- PathParameters: This part is prefixed with `With` and is followed by the names of the path parameters. E.g. `WithIndex`, `WithId`, and `WithIndexId`. This part can be omitted if the operation does not have any path parameters, or if all operations of the action share the same path parameters.

The `search` action mentioned above will have the following operations:
- `Search_Get`
- `Search_Post`
- `Search_Get_WithIndex`
- `Search_Post_WithIndex`

### Defining input and output structures

Operations of the same API action share:
- Identical Output structure
- Similar Input structure:
  - Identical set of querystring parameters
  - Identical schema of the request body, if any
  - Only differ in the path parameters

Due to these characteristics, these operations share the same output structure, and their input structures reuse the same querystring parameters and request body schema. The `search` action, for example, will have the following input and output structures:
- `Search_Output`
- `Search_Get_Input`
- `Search_Post_Input`
- `Search_Get_WithIndex_Input`
- `Search_Post_WithIndex_Input`

These structures are defined in the `structures.smithy` file along with the shared querystring parameters and request body schema. The `search` action's `structures.smithy` file will look like this:
```smithy
@mixin
structure Search_QueryParams {
  ...
}

structure Search_BodyParams {
  ...
}

@input
structure Search_Get_Input with [Search_QueryParams] {
}

@input
structure Search_Post_Input with [Search_QueryParams] {
  @httpPayload
  content: Search_BodyParams,
}

@input
structure Search_Get_WithIndex_Input with [Search_QueryParams] {
  @required
  @httpLabel
  index: PathIndices,
}

@input
structure Search_Post_WithIndex_Input with [Search_QueryParams] {
  @required
  @httpLabel
  index: PathIndices,
  @httpPayload
  content: Search_BodyParams,
}

structure Search_Output {
  ...
}
```

Note that all input structures utilize the `Search_QueryParams` mixin, and The `Search_BodyParams` structure is used as `@httpPayload` for the both POST operations as seen in `Search_Post_Input` and `Search_Post_WithIndex_Input`.

## Defining Common Parameters

Common parameters are defined in the root folder, `model/`, and grouped by data-type in files of `common_<data_type>.smithy` format. There are a few things to note when defining common parameters:
- All path parameters should be prefixed with `Path` like `PathIndex` and `PathDocumentID`.
- Smithy doesn't support _enum_ or _list_ as path parameters. We, therefore, have to define such parameters as _string_ and use `x-data-type` vendor extension to denote their actual types (More on this in the traits section).
- Parameters of type `time` are defined as `string` and has `@pattern("^([0-9]+)(?:d|h|m|s|ms|micros|nanos)$")` trait to denote that they are in the format of `<number><unit>`. E.g. `1d`, `2h`, `3m`, `4s`, `5ms`, `6micros`, `7nanos`. We use `x-data-type: "time"` vendor extension for this type.
- Path parameters that are defined as strings must be accompanied by a `@pattern` trait and should be default to `^[^_][\\d\\w-*]*$` to signify that they are not allowed to start with `_` to avoid URI Conflict errors.
- The `@documentation`, `@default`, and `@deprecation` traits can later be overridden by the operations that use these parameters.

## Smithy Traits
We use Smithy traits extensively in this project to work around some limitations of Smithy and to deal with some quirks of the OpenSearch API. Here are some of the traits that you should be aware of:
- `@vendorExtensions`: Used to add metadata that are not supported by Smithy. Check OpenAPI Vendor Extensions section for more details.
- `@suppress(["HttpMethodSemantics.UnexpectedPayload"])`: Used in DELETE operations with request body to suppress the UnexpectedPayload error.
- `@suppress(["HttpUriConflict"])`: Used to suppress the HttpUriConflict error that is thrown when two operations have conflicting URI. Unfortunately, this happens a lot in OpenSearch API. When in doubt, add this trait to the operation.
- `@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless)")`: Required for most Path parameters to avoid URI Conflict errors. This is often used in tandem with the @suppress trait above. To denote the actual pattern of the parameter, use `x-string-pattern` vendor extension.
- `@readonly`: Should accompany most GET operations to denote that they are read-only.
- `@idempotent`: Should accompany most PUT operations to denote that they are idempotent.

### OpenAPI Vendor Extensions Trait

This repository includes a custom Smithy trait `@vendorExtensions` and accompanying build extension to add metadata that are not supported by Smithy in the form of OpenAPI Vendor Extensions. This trait is used to add the following metadata:
- `x-operation-group`: Used to group operations into API Actions.
- `x-version-added`: OpenSearch version when the operation/parameter was added.
- `x-version-removed`: OpenSearch version when the operation/parameter was removed.
- `x-version-deprecated`: OpenSearch Version when the operation/parameter was deprecated.
- `x-deprecation-description`: Reason for deprecation and guidance on how to prepare for the next major version.
- `x-serialize: "bulk"`: Denotes that request body should be serialized as bulk data.
- `x-data-type`: Denotes the actual data-type of the parameter. This extension is used where certain data-type is not supported by Smithy (like `time`), or not supported in certain context (like `enum` and `list` as **path** parameters).
- `x-enum-options`: List of options for an `enum` **path** parameter.
- `x-string-pattern`: Actual regex pattern for a **path** parameter. This is used to override the pattern used to circumvent URI Conflict errors.
- `x-overloaded-param`: Denotes that the parameter is overloaded with another parameter. This is used in `/_nodes/{node_id}` operation where you can also treat `{node_id}` as `{metric}`. Future operations should avoid this situation because it is bad API design. See [Client Generator Guide](./CLIENT_GENERATOR_GUIDE.md#overloaded-name) for more info.
- `x-ignorable: "true"`: Denotes that the operation should be ignored by the client generator. This is used in operation groups where some operations have been replaced by newer ones, but we still keep them in the specs because the server still supports them.

```smithy
use opensearch.openapi#vendorExtensions

@vendorExtensions(
    "x-operation-group": "search",
    "x-version-added": "1.0"
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_search")
@documentation("Returns results matching a query.")
operation Search_Post_WithIndex {
    input: Search_Post_WithIndex_Input,
    output: Search_Output
}
```

```smithy
@vendorExtensions(
    "x-data-type": "list",
    "x-enum-options": ["settings", "os", "process", "jvm", "thread_pool", "transport", "http", "plugins", "ingest"],
)
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless)")
@documentation("Comma-separated list of metrics you wish returned. Leave empty to return all.")
string PathNodesInfoMetric
```

```smithy
@vendorExtensions(
    "x-data-type": "time",
)
@pattern("^([0-9]+)(?:d|h|m|s|ms|micros|nanos)$")
@documentation("The maximum time to wait for wait_for_metadata_version before timing out.")
string WaitForTimeout
```

## Adding a test-case for API definition

Once you've finished with the model API, follow the steps below to create a test-case.

### File Structure for Test-folder

Let's suppose we have test-cases for put mapping and search api at first.
Structure of the test folder's project tree:
```
test
    ├── scripts
    └── model
        ├── _global
        │    └── search
        │        ├── hooks.js
        │        └── OpenSearchModel.json
        └── indices
            └── put_mapping
                ├── hooks.js
                └── OpenSearchModel.json
```

We'd want to include the *Index-Aliases API* now.
The project-tree structure will be as follows:
```
test
    ├── scripts
    └── model
        ├── _global
        │   └── search
        │        ├── hooks.js
        │        └── OpenSearchModel.json
        └── indices
            ├── put_mapping
            │    ├── hooks.js
            │    └── OpenSearchModel.json
            └── aliases
                ├── hooks.js
                └── OpenSearchModel.json
```

### Defining test-case for API model
Two files must be defined:

1. OpenSearchModel.js: This is a json file that includes the API model's test-case.
- The steps to create this file are listed below.
    - Move to the project-directory.
    - Run ```cd test/scripts```.
    - Run ```python operation-filter.py --operation <operation-id_1,operation-id_2> --output <complete-path>```.
    In case of the Index-aliases API, for example ```python operation-filter.py --operation PostAliases --output /Users/xxx-xxx/Desktop/```.
    - When the preceding step is completed successfully, a file named ```model.openapi.json``` will be generated in the defined directory.
    Copy the contents of the file into the ```OpenSearchModel.json``` file.

2. hooks.js: This file contains the API model's setup and teardown procedures.

NOTE:
1. The arguments ```--operation``` and ```--output``` are necessary.
2. For the ```--output``` parameter, provide the full directory path.

References:
If you're having trouble while writing API test cases, check out the [Index Aliases API](https://github.com/opensearch-project/opensearch-api-specification/pull/41/files).

## Local testing
The procedures outlined here will assist you in ensuring that the API model accurately represents the OpenAPI specification while testing it against the API's backend implementation. To do so, follow the steps below.

### Pre-requisite
- [Install and set-up docker](https://docs.docker.com/get-docker/)
- [Install dredd](https://dredd.org/en/latest/installation.html#installing-dredd)

###  Testing model API
Following the instructions below will allow you to test the API documentation locally.
1. In Docker go-to Preferences > Resources, set RAM to at least 4 GB.
2. Move to project directory then run ```cd test/```.
3. Install all node-modules using ```npm install```.
4. Install all python dependencies using ```pipenv install --system```.
5. Run docker using ```docker-compose up -d```.
6. Wait for around 1 minute (for opensearch domain to be operational).
7. Run ```cd scripts/```.

We are ready with the setup now, for finally testing our API implementation use below commands:

1. To test API implementation on default endpoint and all APIs.
- Run ```python driver-code.py```
2. To test API implementation on default endpoint and specific API.
- Run ```python driver-code.py --testname <test_name>```.
3. To test all the APIs implementation with custom OpenSearch service endpoint.
- Run ```python driver-code.py --endpoint <ENDPOINT_NAME> --user <USERNAME>:<PASSWORD>```.
4. To test API implementation with custom OpenSearch service endpoint and specific APIs.
- Run ```python driver-code.py --endpoint <ENDPOINT_NAME> --user <USERNAME>:<PASSWORD> --path <TEST_DIRECTORY>```.

Arguments supported while testing are mentioned below:
1. *--endpoint:* (String) To specific the custom OpenSearch service URL for testing.
2. *--user:* (String) To specify the username and password associated with the endpoint used.
3. *--path:* (String) To specify the directory path of specific test to be tested.
4. *--testname:* (String) To specify the name of API to be tested if not provided then all the tests are run.
5. *--testpass:* (Boolean) When this option is set to True, a table of passed test cases will be printed as well.
    (By default, only the table for failed test-cases is printed.)

NOTE:
Due to Ubuntu security updates, the version of Ubuntu mentioned in the CI workflow file may not be compatible with the Continuous Integration framework.
