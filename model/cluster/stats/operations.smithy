// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cluster-api/cluster-stats/"
)

@xOperationGroup("cluster.stats")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/stats")
@documentation("Returns high-level overview of cluster statistics.")
operation ClusterStats {
    input: ClusterStats_Input,
    output: ClusterStats_Output
}

@xOperationGroup("cluster.stats")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/stats/nodes/{node_id}")
@documentation("Returns high-level overview of cluster statistics.")
operation ClusterStats_WithNodeId {
    input: ClusterStats_WithNodeId_Input,
    output: ClusterStats_Output
}
