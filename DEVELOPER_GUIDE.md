- [Developer Guide](#developer-guide)
  - [Getting Started](#getting-started)
    - [Fork and Clone opensearch-api-specification Repo](#fork-and-clone-opensearch-api-specification-repo)
  - [Use an Editor](#use-an-editor)
    - [Visual Studio Code](#visual-studio-code)
    - [Build](#build)
  - [Adding a new API definition](#adding-a-new-api-definition)
    - [Naming Convention](#naming-convention)
    - [File Structure](#file-structure)
    - [Defining the API model](#defining-the-api-model)
  
# Developer Guide
Welcome to the ```opensearch-api-specification``` developer guide! Glad you want to contribute. Here are the things you need to know while getting started!

## Getting Started

### Fork and Clone opensearch-api-specification Repo
Fork [opensearch-project/opensearch-api-specification](https://github.com/opensearch-project/opensearch-api-specification) and clone locally, e.g. `git clone https://github.com/[your username]/opensearch-api-specification.git`.


## Use an Editor
### Visual Studio Code
- Install the [Smithy Plugin](https://github.com/awslabs/smithy-vscode)
- If you are editing markdownfiles install [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)

### Build
``` gradle build ```

## Adding a new API definition

### Naming Convention
Within OpenSearch a single API can have multiple HTTP methods associated with it. Lets take the example of the search API. The Search API has the following endpoints and HTTP methods:

```
"methods": ["GET","POST" ]
"paths": ["/_search", "/{index}/_search"]
```

For this example we will **assume** that the API also supports PUT operation:

```
"methods": ["GET","POST", "PUT" ]
"paths": ["/_search", "/{index}/_search"]
```

Within an Interface Definition Language (IDL) we define operations, each operation has a unique HTTP method and URI path. Thus we need to define 6 Operations (3 methods x 2 paths) to describe the entire Search API. The search API contains a request body. GET requests usually do not contain request bodies and is not supported by standard IDL. We will thus discard the GET operations here and are left with 4 Operations. These Operations need to be uniquely named.

The operation name should thus be created using the following:

```[HTTP Method Name][OperationName]with[URLPathParameter1]with[URLPathParameter2] ..```

Thus the operations for the Search API will be named:

* PostSearchOperation

* PostSearchOperationWithIndex

* PutSearchOperation

* PutSearchOperationWithIndex

### File Structure

```
model
├── _global
│   └── search
│       ├── operations.smithy
│       └── structures.smithy
├── common_datatypes.smithy
├── common_enums.smithy
├── common_structures.smithy
└── indices
    └── put_mapping
        ├── enums.smithy
        ├── operations.smithy
        └── structures.smithy

Sample directory tree, may not mirror the ground reality
```

Let's say you would like to implement the put_mapping API. 
The common datatypes, enums and structures (used by multiple operations) willbe kept in the respective files in ```model/```. 
The datatypes, enums and structures specific to one particular API will be in their respective folders

### Defining the API model
 
If you are retrospectively adding the API, Then you can refer to the following resources to create a close approximation:
- [OpenSearch Documentation](https://opensearch.org/docs/latest)
- [Go through the serialisation logic in OpenSearch](https://github.com/opensearch-project/OpenSearch)




