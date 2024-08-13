<!-- TOC -->
- [Spec Testing Guide](#spec-testing-guide)
  - [Running Spec Tests](#running-spec-tests)
    - [Running Spec Tests Locally](#running-spec-tests-locally)
    - [Running Spec Tests with Amazon OpenSearch](#running-spec-tests-with-amazon-opensearch)
    - [Common Errors](#common-errors)
      - [401 Unauthorized](#401-unauthorized)
      - [FORBIDDEN/10/cluster create-index blocked (api)](#forbidden10cluster-create-index-blocked-api)
      - [FAILED  Cat with a json response (from security-analytics).](#failed--cat-with-a-json-response-from-security-analytics)
  - [Writing Spec Tests](#writing-spec-tests)
    - [Simple Test Story](#simple-test-story)
    - [Using Output from Previous Chapters](#using-output-from-previous-chapters)
    - [Managing Versions](#managing-versions)
    - [Waiting for Tasks](#waiting-for-tasks)
    - [Warnings](#warnings)
      - [multiple-paths-detected](#multiple-paths-detected)
      - [Suppressing Warnings](#suppressing-warnings)
<!-- TOC -->

# Spec Testing Guide

We have devised our own test framework to test the spec against an OpenSearch cluster. We're still adding more features to the framework as the needs arise, and this document will be updated accordingly. This test framework has also been integrated into the repo's CI/CD pipeline. Checkout the [test-spec](.github/workflows/test-spec.yml) workflow for more details.

## Running Spec Tests

### Running Spec Tests Locally

Set up an OpenSearch cluster with Docker:

(Replace `<<your_password>>` with your desired password. If not provided, the default password inside the `docker-compose.yml` file will be used.)
```bash
export OPENSEARCH_PASSWORD=<<your_password>>
cd tests/default
docker compose up -d
```

Run the tests (use `--opensearch-insecure` for a local cluster running in Docker that does not have a valid SSL certificate):
```bash
npm run test:spec -- --opensearch-insecure
```

Run a specific test story:
```bash
npm run test:spec -- --opensearch-insecure --tests tests/default/_core/info.yaml
```

Verbose output:
```bash
npm run test:spec -- --opensearch-insecure --verbose
```

### Running Spec Tests with Amazon OpenSearch

Use an Amazon OpenSearch service instance.

```bash
export AWS_ACCESS_KEY_ID=<<your AWS access key ID>>
export AWS_SECRET_ACCESS_KEY=<<your AWS secret access key>>
export AWS_SESSION_TOKEN=<<optional AWS session token>>
export AWS_REGION=us-west-2
export OPENSEARCH_URL=https://....us-west-2.es.amazonaws.com

npm run test:spec
```

### Common Errors

#### 401 Unauthorized

Remember to set the `OPENSEARCH_PASSWORD` or `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables every time you start a new shell to run the tests.

#### FORBIDDEN/10/cluster create-index blocked (api)

The cluster is most likely hitting a disk watermark threshold. This example sets the disk watermark thresholds to 1500MB low, 100MB high, and 500MB flood stage, allowing the cluster to create indices even if the disk is almost full.

```bash
curl -k -X PUT --user "admin:${OPENSEARCH_PASSWORD}" https://localhost:9200/_cluster/settings -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "cluster.routing.allocation.disk.watermark.low": "1500mb",
    "cluster.routing.allocation.disk.watermark.high": "1000mb",
    "cluster.routing.allocation.disk.watermark.flood_stage": "500mb",
    "cluster.blocks.create_index" : null
  }
}
'
```

#### FAILED  Cat with a json response (from security-analytics).
The cluster is not loading plugins correctly, maybe it was stopped using `docker kill` instead of `docker stop`. Recreating the cluster should fix the issue: `docker compose up --force-recreate -d`.

## Writing Spec Tests

The spec tests reside in the [tests/](tests) directory. Tests are organized in suites ([default](tests/default/), etc.), and subsequently in folders that match [namespaces](spec/namespaces). For example, tests for APIs defined in [spec/namespaces/indices.yaml](spec/namespaces/indices.yaml) can be found in [tests/default/indices/index.yaml](tests/default/indices/index.yaml) (for `/{index}`), and [tests/default/indices/doc.yaml](tests/default/indices/doc.yaml) (for `/{index}/_doc`). 

Additional suites require custom configuration that is defined in a separate `docker-compose.yml`. For example [tests/plugins/index_state_management/docker-compose.yml](tests/plugins/index_state_management/docker-compose.yml) uses a custom setting of `plugins.index_state_management.job_interval=1` to cause the `/_nodes` API to return plugin information tested in [tests/plugins/index_state_management/nodes/plugins/index_state_management.yaml](tests/plugins/index_state_management/nodes/plugins/index_state_management.yaml).

Each yaml file in the tests directory represents a test story that tests a collection of related operations.

A test story has 3 main components:
- prologues: These are the operations that are executed before the test story is run. They are used to set up the environment for the test story.
- chapters: These are the operations that are being tested.
- epilogues: These are the operations that are executed after the test story is run. They are used to clean up the environment after the test story.

Check the [test_story JSON Schema](json_schemas/test_story.schema.yaml) for the complete structure of a test story.

### Simple Test Story

Below is the simplified version of the test story that tests the [index operations](tests/default/indices/index.yaml):
```yaml
$schema: ../../json_schemas/test_story.schema.yaml # The schema of the test story. Include this line so that your editor can validate the test story on the fly.

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
    parameters: # All parameters are validated against their schemas in the spec.
      index: books
    request: # The request.
      headers: # Optional headers.
        user-agent: OpenSearch API Spec/1.0
      payload: # The request body is validated against the schema of the requestBody in the spec.
        mappings:
          properties:
            name:
              type: keyword
            age:
              type: integer
        settings:
          number_of_shards: 5
          number_of_replicas: 2
    response: # The response.
      payload: # Matching response payload. The entire payload is validated against the schema of the corresponding response in the spec.
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

Consider the following chapters in [ml/model_groups](tests/default/ml/model_groups.yaml) test story:
```yaml
  - synopsis: Create model group.
    id: create_model_group # Only needed if you want to refer to this chapter in another chapter.
    path: /_plugins/_ml/model_groups/_register
    method: POST
    request:
      payload:
        name: NLP_Group
        description: Model group for NLP models.
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

You can also reuse output in payload expectations. See [tests/plugins/index_state_management/nodes/plugins/index_state_management.yaml](tests/plugins/index_state_management/nodes/plugins/index_state_management.yaml) for an example.

### Managing Versions

It's common to add a feature to the next version of OpenSearch. When adding a new API in the spec, make sure to specify `x-version-added`, `x-version-deprecated` or `x-version-removed`. Finally, specify a semver or a semver range in your test stories or chapters as follows.

```yaml
- synopsis: Search with `phase_took` added in OpenSearch 2.12 and removed in version 3.
  version: '>=2.12 <3'
  path: /{index}/_search
  parameters:
    index: movies
    cancel_after_time_interval: 10s
  method: POST
  response:
    status: 200
```

The [integration test workflow](.github/workflows/test-spec.yml) runs a matrix of OpenSearch versions, including the next version. Please check whether the workflow needs an update when adding version-specific tests.

### Waiting for Tasks

Some APIs behave asynchronously and may require a test to wait for a task to complete. This can be achived with a combination of `payload` and `retry`. 

For example, an ML task returns `CREATED` when created, and `COMPLETED` when it's done. The example below will retry 3 times with an interval of 30 seconds until the task is complete. The default wait time is 1s.

```yaml
  - synopsis: Wait for task.
    path: /_plugins/_ml/tasks/{task_id}
    method: GET
    parameters:
      task_id: ${create_model.task_id}
    response:
      status: 200
      payload:
        state: COMPLETED
    retry:
      count: 3
      wait: 30000
```
### Warnings

#### multiple-paths-detected

The test runner expects all tests in the same file to be variation of the same path in order to keep tests well-organized. Otherwise, a warning will be emitted.

```
WARNING Multiple paths detected, please group similar tests together and move paths not being tested to prologues or epilogues.
  /_component_template/{name}
  /_index_template/{name}
  /{index}
```

#### Suppressing Warnings

The test runner may generate warnings that can be suppressed with `warnings:`. For example, to suppress the multiple paths detected warning.

```yaml
- synopsis: Create an index.
  method: PUT
  path: /{index}
  parameters:
    index: movies
- synopsis: Search the index to make sure it has been created.
  method: POST
  warnings:
    multiple-paths-detected: false
  path: /{index}/_search
  parameters:
    index: movies
```
