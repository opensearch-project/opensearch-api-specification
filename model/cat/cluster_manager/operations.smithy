// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-cluster_manager/"
)

@xOperationGroup("cat.cluster_manager")
@xVersionAdded("2.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/cluster_manager")
@documentation("Returns information about the cluster-manager node.")
operation CatClusterManager {
    input: CatClusterManager_Input,
    output: CatClusterManager_Output
}
