namespace OpenSearch

// https://opensearch.org/docs/latest/opensearch/rest-api/index-apis/create-index/

@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}")
@documentation("Creates index mappings.")
operation PutCreateIndex {
    input: PutCreateIndexInput,
    output: PutCreateIndexOutput
}