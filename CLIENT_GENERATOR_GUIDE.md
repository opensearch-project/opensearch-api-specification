- [Generate Clients for OpenSearch using OpenAPI Specification](#generate-clients-for-opensearch-using-openapi-specification)
  - [The Grouping of API Operations](#the-grouping-of-api-operations)
  - [Overloaded Name](#overloaded-name)
  - [Handling Bulk Operations](#handling-bulk-operations)
  - [Parameter Validation](#parameter-validation)
  - [Global Parameters](#global-parameters)
  - [Default Parameter Values](#default-parameter-values)
  - [Duplicate Paths](#duplicate-paths)
  - [Schema Composition](#schema-composition)
    - [Normalization](#normalization)
    - [Merging allOf](#merging-allof)
    - [Classifying Unions](#classifying-unions)
    - [Representation per Language](#representation-per-language)
    - [Conformance Levels](#conformance-levels)
    - [Testing a Generator](#testing-a-generator)

# Generate Clients for OpenSearch using OpenAPI Specification

OpenSearch Clients are available in multiple programming languages. The biggest challenge with this is keeping the clients up to date with the latest changes in OpenSearch. To solve this problem, we're automating the process of generating clients for OpenSearch using the OpenAPI specification. While OpenAPI comes with many well established off-the-shelf client generators for most languages, the OpenSearch APIs come with a lot of quirkiness that makes it near impossible to use these off-the-shelf generators. For this reason, we've opted to write our own client generators that is specifically tailored to the OpenSearch APIs. This document will walk you through the process of generating clients from [the published OpenSearch OpenAPI spec](https://github.com/opensearch-project/opensearch-api-specification/releases), more specifically client API methods.

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

In the [published OpenAPI spec](https://github.com/opensearch-project/opensearch-api-specification/releases), this grouping is denoted by `x-operation-group` vendor extension in every operation definition. The value of this extension is the name of the API action (like `search` or `indices.get_field_mapping`). Operations with the same `x-operation-group` value are guaranteed to have the same query string parameters, response body, and request body (for PUT/POST/DELETE operations). Common path parameters are also guaranteed to be the same. The only differences between operations are the HTTP method and the path. With that in mind, below are rules on how to combine operations of different HTTP methods and path compositions.

- If an operation is marked with `x-ignorable: true`, then ignore the operation. Such an operation has been deprecated and has been superseded by a newer one. As far as the clients are concerned, ignorable operations do not exist.
- If two operations have identical HTTP methods, but different paths: use the path that best matches the path parameters provided.
- If two operations have identical path, but different HTTP methods:
    - GET/POST: if the request body is provided then use POST, otherwise use GET
    - PUT/POST: Either works, but PUT is preferred when an optional path parameter is provided.

The pseudocode that combines the `search` operations into a single API method is as follows:
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
You will also encounter `x-overloaded-param: metric` for the `node_id` path parameter of the `GET /_nodes/{node_id}` operation in `nodes.info` action. This is a special case where the path parameter is overloaded to accept either a node ID or a metric name. When the user evokes the `client.nodes.info` method with either `metric` or `node_id` (but not both), the method will use the `GET /_nodes/{node_id}` operation. When evoked with both `metric` and `node_id`, it will use the `GET /_nodes/{node_id}/{metric}` operation.

## Handling Bulk Operations
Some operations accept a bulk of data in the request body. For example, the `bulk` action accepts a bulk of index, update, and delete operations on multiple documents. Unlike other operations where the request body is a **JSON object**, the request body for bulk operations is an **NDJSON** (i.e a [Newline-delimited JSON](https://github.com/ndjson/ndjson-spec)). 

In the spec, these request bodies have the `content` of `application/x-ndjson` and their schemas are of type array. In this situation, the client must serialize the request body accordingly, and set the `Content-Type` header to `application/x-ndjson`.

## Parameter Validation
As of right now, most clients only validate whether required parameters are present. The clients do not validate the values of parameters against the enum values or regex patterns. This is to reduce performance overhead for the clients as the validation is already done on the server. However, the list of enum values and regex patterns are often written into the parameter description.

Some clients also check for the validity of query string parameter names to guard the users from typos. If you decide to implement this feature, make sure that it's performant. Scripting languages like Python and Ruby require the code to be loaded into memory at runtime, and constructs used for this feature can be expensive to load, as far as microservices are concerned.

## Global Parameters
All operations in the spec contain a set of parameters that are common across all operations. These parameters are denoted with `x-global: true` vendor extension. The generated clients should find a way to DRY these parameters in type definitions and method documentation.

## Default Parameter Values
Parameters can have default values either through schema or the `x-default` vendor extension. When both are present, `x-default` will take precedence.

## Duplicate Paths
OpenAPI does not allow duplicate paths, which makes it challenging to express certain OpenSearch APIs, such as `/_nodes/{node_id}` and `/_nodes/{metric}`. In this example the server expects either a `node_id` or a `metric`. The API specification handles this by defining a `/_nodes/{node_id_or_metric}` path, and decorating the `node_id_or_metric` type with a `title` field.

```yaml
name: node_id_or_metric
schema:
anyOf:
  - title: node_id
    $ref: '../schemas/_common.yaml#/components/schemas/NodeIds'
  - title: metric
    type: array
    items:
      $ref: '../schemas/nodes.info.yaml#/components/schemas/Metric'
```

See [#416](https://github.com/opensearch-project/opensearch-api-specification/pull/416) for a complete example.

Clients should generate multiple methods or a method that accepts multiple parameters in this case.

## Schema Composition
The spec builds complex types from simpler ones with the JSON Schema composition keywords `allOf`, `oneOf` and `anyOf`, and often nests one inside another. Every shape described here is valid JSON Schema and is used by the spec today. A generator that only understands a subset of them tends to drop what it does not recognize, which produces types with missing properties. The rules below define how a generator must read these schemas, independent of the target language.

The keywords **MUST**, **MUST NOT**, **SHOULD** and **MAY** are used as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

### Normalization
Apply these rules before merging or classifying anything.

- **N1, sibling properties.** A schema that has `properties`, `required` or `additionalProperties` next to `allOf`, `oneOf` or `anyOf` must satisfy both. Treat it as an `allOf` whose first member holds those siblings. Generators MUST NOT discard them.

  ```yaml
  # _common.query_dsl.yaml, TermsLookup
  TermsLookup:
    type: object
    properties: { index: …, id: …, path: …, routing: …, query: …, store: … }
    required: [index, path]
    allOf:
      - oneOf:
          - required: [id]
          - required: [query]

  # is equivalent to
  TermsLookup:
    allOf:
      - { type: object, properties: { index: …, id: …, path: …, routing: …, query: …, store: … }, required: [index, path] }
      - oneOf:
          - required: [id]
          - required: [query]
  ```

- **N2, unions as allOf members.** An `allOf` member that is itself a `oneOf` or `anyOf` is a separate constraint. The result is the object part combined with every union: `allOf: [X, {oneOf: [A, B]}, {oneOf: [C, D]}]` means `X ∧ (A ∨ B) ∧ (C ∨ D)`. Generators MUST NOT drop a union member, and MUST NOT concatenate several union members into one union (`A ∨ B ∨ C ∨ D`).

  ```yaml
  # _common.aggregations.yaml, MetricAggregationBase: missing, plus field and/or script
  MetricAggregationBase:
    allOf:
      - type: object
        properties: { missing: { $ref: '_common.yaml#/components/schemas/FieldValue' } }
      - anyOf:
          - properties: { field: { $ref: '_common.yaml#/components/schemas/Field' } }
          - properties: { script: { $ref: '_common.yaml#/components/schemas/Script' } }
  ```

- **N3, resolve branches before classifying.** Before deciding what kind of union a `oneOf`/`anyOf` is (see [Classifying Unions](#classifying-unions)), resolve each branch: follow `$ref`, then apply N1, N2 and the merge rules. Classify the resolved branch, not its raw form. For example, most branches of `AggregationContainer` are a `$ref` to an `allOf` such as `AutoDateHistogramAggregation: allOf: [BucketAggregationBase, {properties: {auto_date_histogram: …}, required: [auto_date_histogram]}]`. Resolved, each branch still has exactly one required key.
- **N4, annotations.** `title`, `description`, `x-version-added`, `x-version-deprecated`, `unevaluatedProperties` and similar annotations do not change the shape of a type.

### Merging allOf
- **M1, properties.** The properties of an `allOf` are the union of its members' properties. A `$ref` member MAY be emitted as a base type, interface or embedded struct, but its properties count as present.
- **M2, requiredness.** A property is required if any member lists it in `required`.
- **M3, redeclared properties.** If several members declare the same property, its schema is the `allOf` of those declarations. If the declarations cannot both hold (for example `string` and `boolean`), the generator MUST fail with a message naming the schema and the property. It MUST NOT silently keep one of the declarations, and MUST NOT crash without that context. `integer` and `number` are compatible.
- **M4, flattening a union into an object.** When a language or a case has no suitable union representation, the branches MAY be flattened into one object whose fields are the union of the branch properties. A flattened field is required only if it is required in **every** branch or in the object part. The constraint that was lost MUST be documented on the generated type and SHOULD be checked when serializing.

### Classifying Unions
After normalization, classify each `oneOf`/`anyOf` with the first rule that matches.

| Class | Test | Examples |
|---|---|---|
| **U1, internally tagged** | A `discriminator` is present. | `Property`, `Analyzer` |
| **U2, externally tagged container** | Every resolved branch has exactly one required property, the names differ across branches, and each value is an object. The non-union members of the surrounding `allOf` are fields shared by every variant. | `AggregationContainer` (shared `meta`, sub-aggregations), `RequestProcessor`, `ResponseProcessor` |
| **U3, presence constraint** | Every branch only makes properties of the object part required, or adds optional properties. The union constrains which fields are set; it does not define variants. | `TermsLookup` (`id` or `query`), `MetricAggregationBase` (`field` and/or `script`, both optional) |
| **U4, titled union** | *Every* branch has a `title`, which names the variant. A union where only some branches are titled does not qualify. | `TermsQueryField`, `node_id_or_metric` (see [Duplicate Paths](#duplicate-paths)) |
| **U5, scalar or array union** | Branches are scalars, enums, arrays of the same item, or `null`, e.g. `T` or `T[]`. | `Fields`, `FieldValue` |
| **U6, unclassified** | None of the above. | |

For U6, the generator MUST report the schema at generation time. It MAY fall back to a raw JSON type, but MUST NOT silently drop the union. A U3 union whose branches require nothing is equivalent to plain optional fields, so it MAY be emitted as one flat object.

### Representation per Language
These are the recommended representations. Each generator chooses what fits its language, as long as the [conformance levels](#conformance-levels) hold.

| Shape | TypeScript | Java | Go | C# | Rust |
|---|---|---|---|---|---|
| `allOf` merge | `A & B`, or one merged object | `extends` plus own fields | embedded struct plus fields | base class plus properties | struct with `#[serde(flatten)]` members |
| U2 container | `Shared & ({ avg: Avg } \| { terms: Terms } \| …)` | tagged union with a `Kind` enum and shared fields | struct with one pointer field per variant plus shared fields; `MarshalJSON` checks that exactly one is set | interface with one property per variant plus shared properties | `struct { #[serde(flatten)] shared, #[serde(flatten)] kind: Enum }` with an externally tagged enum, plus a custom `Deserialize` to enforce exactly one variant |
| U3 constraint | `Object & ({ id: Id } \| { query: Query })` | flattened fields (M4), checked in `build()` | flattened optional fields (M4) | flattened properties (M4) | flattened `Option<T>` fields (M4) |
| U1 | discriminated union on the tag literal | tagged union | interface plus type switch | polymorphic converter | `#[serde(tag = "…")]` enum |

For example, a TypeScript generator renders the two schemas above as:

```ts
export type TermsLookup = {
  id?: Id; index: IndexName; path: Field; query?: QueryContainer; routing?: Routing; store?: boolean;
} & ({ id: Id } | { query: QueryContainer })

export type MetricAggregationBase = { missing?: FieldValue } & ({ field?: Field } | { script?: Script })
```

### Conformance Levels
- **Level 1, no information loss (MUST).** Every property in the spec is reachable in the generated type, with the requiredness given by M2 and M4.
- **Level 2, constraint fidelity (SHOULD).** The exactly-one constraint of U2 and the presence constraint of U3 are enforced, by the type system or when serializing.

A generator that flattens unions (M4) can meet Level 1 without meeting Level 2.

### Testing a Generator
Generators SHOULD have tests that render each shape in this section from a small spec and check the result: at least N1 (`TermsLookup`), N2 with an `anyOf` member (`MetricAggregationBase`), N2 with two union members, U2 (`AggregationContainer`, including a `$ref` branch), and an M3 conflict. Running the tests against the bundled spec in CI, before generated code is published, catches spec changes that introduce a new shape.
