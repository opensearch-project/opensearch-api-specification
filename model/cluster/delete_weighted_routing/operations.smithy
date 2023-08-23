// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cluster-api/cluster-awareness/#example-deleting-weights"
)

@xOperationGroup("cluster.delete_weighted_routing")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_cluster/routing/awareness/weights")
@documentation("Delete weighted shard routing weights.")
operation ClusterDeleteWeightedRouting {
    input: ClusterDeleteWeightedRouting_Input,
    output: ClusterDeleteWeightedRouting_Output
}
