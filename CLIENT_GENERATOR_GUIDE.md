# Generate Clients for OpenSearch using OpenAPI Specification

OpenSearch Clients are available in multiple programming languages. The biggest challenge with this is keeping the clients up to date with the latest changes in OpenSearch. To solve this problem, we're automating the process of generating clients for OpenSearch using the OpenAPI specification. While OpenAPI comes with many well established off-the-shelf client generators for most languages, the OpenSearch APIs come with a lot of quirkiness that makes it near impossible to use these off-the-shelf generators. For this reason, we've opted to write our own client generators that is specifically tailored to the OpenSearch APIs. This document will walk you through the process of generating clients from [OpenSearch OpenAPI spec](builds/OpenSearch.latest.yaml), more specifically client API methods.

## The Grouping of API Operations
The OpenSearch clients, though written in different languages for different frameworks, share one distinct characteristic: API Operations are grouped into actions and namespaces. Operations serving the same functionality are often grouped together into a single API Action, which is represented in the client as an API method.

The **search** action, for example, is consisted of 4 operations:
- `GET /_search`
- `POST /_search`
- `GET /{index}/_search`
- `POST /{index}/_search`

The **indices.get_field_mapping**, is consisted of 2 operations:
- `GET /_mapping/field/{fields}`
- `GET /{index}/_mapping/field/{fields}`

In a client, the `search` operations are grouped in to a single API method, `client.search(...)`, and the `indices.get_field_mapping` operations are grouped into a single API method, `get_field_mapping` of the `indices` namespace, `client.indices.get_field_mapping(...)`

In the [OpenAPI spec](./builds/OpenSearch.latest.yaml), this grouping is denoted by `x-operation-group` vendor extension in every operation definition. The value of this extension is the name of the API action (like `search` or `indices.get_field_mapping`). Operations with the same `x-operation-group` value are guaranteed to have the same query string parameters, response body, and request body (for PUT/POST/DELETE operations). Common path parameters are also guaranteed to be the same. The only differences between operations are the HTTP method and the path. With that in mind, below are rules on how to combine operations of different HTTP methods and path compositions.

- If an operation is marked with `x-ignorable: "true"`, then ignore the operation. Such an operation has been deprecated and has been replaced by a newer one. As far as the clients are concerned, ignorable operations do not exist.
- If two operations have identical HTTP methods, but different paths: use the path that best matches the path parameters provided.
- If two operations have identical path, but different HTTP methods:
    - GET/POST: if the request body is provided then use POST, otherwise use GET
    - PUT/POST: Either works, but PUT is preferred when an optional path parameter is provided.

The psuedo-code that combines the `search` operations into a single API method is as follows:
```python
def search(self, index=None, body=None):
    if index is None:
        path = "/_search"
    else:
        path = f"/{index}/_search"

    if body is None:
        method = "GET"
    else:
        method = "POST"

    return self.perform_request(method, path, body=body)
```


## Overloaded Name
You will also encounter `x-overloaded-param: "metric"` for the `node_id` path parameter of `GET /_nodes/{node_id}` operation in `nodes.info` action. This is a special case where the path parameter is overloaded to accept either a node ID or a metric name. The `client.nodes.info` method when called with either `metric` or `node_id` (but not both), will use `GET /_nodes/{node_id}` operation (even though the path parameter name is `node_id`). When called with both `metric` and `node_id`, it will use `GET /_nodes/{node_id}/{metric}` operation.

## Handling Bulk Operations
Some operations accept a bulk of data in the request body. For example, the `bulk` action accepts a bulk of index, update, and delete operations on multiple documents. Unlike other operations where the request body is a JSON object, the request body for bulk operations is a newline-seperated JSON string. The client will automatically convert the request body into a newline-seperated JSON objects. The request body of such operations will be denoted with `x-serialize: "bulk"` vendor extension.

## Parameter Validation
As of right now, most clients only validate whether required parameters are present. The clients do not validate the values of parameters against the enum values or regex patterns. This is to reduce performance overhead for the clients as the validation is already done on the server. However, the list of enum values and regex patterns are often written into the parameter description.

Some clients also check for the validity of query string parameter names to guard the users from typos. If you decide to implement this feature, make sure that it's performant. Scripting languages like Python and Ruby require the code to be loaded into memory at runtime, and constructs used for this feature can be expensive to load, as far as micro-services are concerned.
