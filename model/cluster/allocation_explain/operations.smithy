// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cluster-api/cluster-allocation/"
)

@xOperationGroup("cluster.allocation_explain")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/allocation/explain")
@documentation("Provides explanations for shard allocations in the cluster.")
operation ClusterAllocationExplain_Get {
    input: ClusterAllocationExplain_Get_Input,
    output: ClusterAllocationExplain_Output
}

@xOperationGroup("cluster.allocation_explain")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_cluster/allocation/explain")
@documentation("Provides explanations for shard allocations in the cluster.")
operation ClusterAllocationExplain_Post {
    input: ClusterAllocationExplain_Post_Input,
    output: ClusterAllocationExplain_Output
}
