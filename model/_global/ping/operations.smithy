namespace OpenSearch

// https://opensearch.org/docs/latest/opensearch/rest-api/index-apis/ping/

@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/")
@documentation("It checks whether the cluster is up and available to process requests.")
operation GetPingCluster {
    input: GetPingClusterInput,
    output: GetPingClusterOutput
}
