namespace OpenSearch

// https://opensearch.org/docs/latest/opensearch/rest-api/put-mapping/

@http(method: "PUT", uri: "/_mapping")
@suppress(["HttpUriConflict"])
@documentation("The put mapping API operation lets you add new mappings and fields to an index.")
operation PutIndexMapping {
    input: PutIndexMappingInput,
    output: PutIndexMappingOutput
}

@http(method: "PUT", uri: "/{index}/_mapping")
@suppress(["HttpUriConflict"])
@documentation("The put mapping API operation lets you add new mappings and fields to an index.")
operation PutIndexMappingWithIndex {
    input: PutIndexMappingWithIndexInput,
    output: PutIndexMappingOutput
}