namespace OpenSearch

// https://opensearch.org/docs/latest/opensearch/rest-api/delete-index/

@http(method: "DELETE", uri: "/{index}")
@suppress(["HttpUriConflict"])
@documentation("This Delete API operation lets you delete an index.")
operation DeleteIndex {
    input: DeleteIndexInput,
    output: DeleteIndexOutput
}

