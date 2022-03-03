namespace OpenSearch

// https://opensearch.org/docs/latest/opensearch/rest-api/cat-nodes/

@readonly
@http(method: "GET", uri: "/_cat/nodes")
@suppress(["HttpUriConflict"])
@documentation("The Cat Nodes API operation lets you know information about a cluster’s nodes.")
operation GetCatNodes {
    input: GetCatNodesInput,
    output: GetCatNodesOutput,
}