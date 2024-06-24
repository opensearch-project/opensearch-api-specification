<!-- TOC -->
* [Specification Testing](#specification-testing)
  * [Running Spec Tests Locally](#running-spec-tests-locally)
  * [Writing Spec Tests](#writing-spec-tests)
    * [Simple Test Story](#simple-test-story)
    * [Using Output from Previous Chapters](#using-output-from-previous-chapters)
<!-- TOC -->

# Specification Testing

We have devised our own test framework to test the spec against an OpenSearch cluster. We're still adding more features to the framework as the needs arise, and this document will be updated accordingly. This test framework has also been integrated into the repo's CI/CD pipeline. Checkout the [test-spec](.github/workflows/test-spec.yml) workflow for more details.

## Running Spec Tests Locally

Set up an OpenSearch cluster with Docker:

(Replace `<<your_password>>` with your desired password. If not provided, the default password inside the `docker-compose.yml` file will be used.)
```bash
export OPENSEARCH_PASSWORD=<<your_password>>
cd .github/opensearch-cluster
docker-compose up -d
```

Run the tests (use `--opensearch-insecure` for a local cluster running in Docker that does not have a valid SSL certificate):
```bash
npm run test:spec -- --opensearch-insecure
```

Run a specific test story:
```bash
npm run test:spec -- --opensearch-insecure --tests tests/_core/info.yaml
```

Verbose output:
```bash
npm run test:spec -- --opensearch-insecure --verbose
```

Note: Remember to set the `OPENSEARCH_PASSWORD` environment variable everytime you start a new shell to run the tests. Failing to do so will result in 401 Unauthorized errors.

## Writing Spec Tests

The spec tests reside in the [tests/](tests) directory. Tests are organized in folders that match [namespaces](spec/namespaces). For example, tests for APIs defined in [spec/namespaces/indices.yaml](spec/namespaces/indices.yaml) can be found in [tests/indices/index.yaml](tests/indices/index.yaml) (for `/{index}`), and [tests/indices/_doc.yaml](tests/indices/_doc.yaml) (for `/{index}/_doc`).

Each yaml file in the tests directory represents a test story that tests a collection of related operations.

A test story has 3 main components:
- prologues: These are the operations that are executed before the test story is run. They are used to set up the environment for the test story.
- chapters: These are the operations that are being tested.
- epilogues: These are the operations that are executed after the test story is run. They are used to clean up the environment after the test story.

Check the [test_story JSON Schema](json_schemas/test_story.schema.yaml) for the complete structure of a test story.

### Simple Test Story

Below is the simplified version of the test story that tests the [index operations](tests/indices/index.yaml):
```yaml
$schema: ../json_schemas/test_story.schema.yaml # The schema of the test story. Include this line so that your editor can validate the test story on the fly.

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

### Using Output from Previous Chapters

Consider the following chapters in [ml/model_groups](tests/ml/model_groups.yaml) test story:
```yaml
  - synopsis: Create model group.
    id: create_model_group # Only needed if you want to refer to this chapter in another chapter.
    path: /_plugins/_ml/model_groups/_register
    method: POST
    request_body:
      payload:
        name: "NLP_Group"
        description: "Model group for NLP models"
    response:
      status: 200
    output: # Save the model group id for later use.
      test_model_group_id: "payload.model_group_id"
  - synopsis: Query model group.
    path: /_plugins/_ml/model_groups/{model_group_id}
    method: GET
    parameters:
      # Use the output from the `create_model_group` chapter.
      model_group_id: ${create_model_group.test_model_group_id}
    response:
      status: 200
  - synopsis: Delete model group.
    path: /_plugins/_ml/model_groups/{model_group_id}
    method: DELETE
    parameters:
      # Use the output from the `create_model_group` chapter.
      model_group_id: ${create_model_group.test_model_group_id}
    response:
      status: 200
```
As you can see, the `output` field in the first chapter saves the `model_group_id` from the response body. This value is then used in the subsequent chapters to query and delete the model group.