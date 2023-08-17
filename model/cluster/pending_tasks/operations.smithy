// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@xOperationGroup("cluster.pending_tasks")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/pending_tasks")
@documentation("Returns a list of any cluster-level changes (e.g. create index, update mapping,
allocate or fail shard) which have not yet been executed.")
operation ClusterPendingTasks {
    input: ClusterPendingTasks_Input,
    output: ClusterPendingTasks_Output
}
