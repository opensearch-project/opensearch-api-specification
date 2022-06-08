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
  - [Adding a test-case for API definition](#adding-a-test-case-for-api-definition)
    - [Pre-requisites](#pre-requisites)
    - [File Structure](#file-structure-for-test-folder)
    - [Defining test-case for API model](#defining-test-case-for-api-model)
  - [Local testing](#local-testing)
    - [Pre-requisites](#pre-requisite)
    - [Testing model API](#testing-model-api)    
  
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

## Adding a test-case for API definition

Once you've finished with the model API, follow the steps below to create a test-case.

### Pre-requisites
1. In the *build.gradle.kts* file, include the dependency. 

   ```
    classpath("software.amazon.smithy:smithy-openapi:1.21.0")
   ```
  
2. In the *smithy-build.json* file, include the plugin. 

    ```
     "plugins": {
          "openapi": {
              "service": "OpenSearch#OpenSearch",
              "protocol": "aws.protocols#restJson1"
          }
      }
    ```   

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
        │        └── OpenSearchModel.js
        └── indices
            └── put_mapping
                ├── hooks.js
                └── OpenSearchModel.js
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
        │        └── OpenSearchModel.js
        └── indices
            ├── put_mapping
            │    ├── hooks.js
            │    └── OpenSearchModel.js
            └── aliases
                 ├── hooks.js
                 └── OpenSearchModel.js     
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
       Copy the contents of the file into the ```OpenSearchModel.js``` file.    

2. hooks.js: This file contains the API model's setup and teardown procedures.

NOTE: 
1. The arguments ```--operation``` and ```--output``` are necessary.
2. For the ```--output``` parameter, provide the full directory path. 

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

_NOTE:_ 
Arguments supported while testing are mentioned below:
1. *--endpoint:* (String) To specific the custom OpenSearch service URL for testing.
2. *--user:* (String) To specify the username and password associated with the endpoint used.
3. *--path:* (String) To specify the directory path of specific test to be tested. 
4. *--testname:* (String) To specify the name of API to be tested if not provided then all the tests are run.
5. *--testpass:* (Boolean) When this option is set to True, a table of passed test cases will be printed as well.
    (By default, only the table for failed test-cases is printed.) 




