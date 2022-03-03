namespace OpenSearch

// https://opensearch.org/docs/latest/opensearch/rest-api/cat-indices/

@readonly
@http(method: "GET", uri: "/_cat/indices")
@suppress(["HttpUriConflict"])
@documentation("The Cat Indicies API operation lets you read high level information about indices.")
operation GetCatIndices {
    input: GetCatIndicesInput,
    output: GetCatIndicesOutput
}


@readonly
@http(method: "GET", uri: "/_cat/indices/{index}")
@suppress(["HttpUriConflict"])
@documentation("The Cat Indicies API operation lets you read high level information about indices with index")
operation GetCatIndicesWithIndex {
    input: GetCatIndicesWithIndexInput,
    output: GetCatIndicesWithIndexOutput
}