# Tests

This project uses [dredd](https://dredd.org) to test the spec against a live instance OpenSearch. Any API marked as `x-tested: true` will be tested.

## Running Locally

To run locally you will need Docker. For the examples below we'll use `BobgG7YrtsdKf9M` as the initial admin password, but YMMV.

Start OpenSearch.

```bash
docker pull opensearchproject/opensearch:2.13.0
docker run -d -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" -e "OPENSEARCH_INITIAL_ADMIN_PASSWORD=BobgG7YrtsdKf9M" opensearchproject/opensearch:2.13.0
```

Generate the spec and run `dredd` from inside [tools](../tools).

```
npm run merge -- --source ./spec --output ../build/opensearch-openapi-tested.yaml --x-include=x-tested
npm run dredd -- --user "admin:BobgG7YrtsdKf9M" ./build/opensearch-openapi-tested.yaml https://localhost:9200
```

## Writing Tests

Mark the API that is being tested with `x-tested: true`. Test spec used for testing is generated with `npm run merge -- --x-include=x-tested` and only includes marked APIs. 

```yaml
  /_cat:
    get:
      operationId: cat.help.0
      x-operation-group: cat.help
      x-version-added: '1.0'
      x-tested: 1
      description: Returns help for the Cat APIs.
      responses:
        '200':
          $ref: '#/components/responses/cat.help@200'
```

For `GET` APIs, provide an example for the default response (`cat.help@200` in the example above). The easiest way to obtain an example for the `_cat` API is by using `curl` with `curl -k --user "admin:BobgG7YrtsdKf9M" https://localhost:9200/_cat`. Include the example with the correct content-type in the spec.

```yaml
    cat.help@200:
      description: ''
      content:
        text/plain:
          schema:
            type: array
            items:
              $ref: '../schemas/cat.help.yaml#/components/schemas/HelpRecord'
        examples:
          text/plain:
            value: >
              =^.^=
              /_cat/allocation
              /_cat/segment_replication
              /_cat/segment_replication/{index}
              ...
```

## Github Actions

Tests run on pull requests via [tests-spec.yml](../.github/workflows/tests-spec.yml).
