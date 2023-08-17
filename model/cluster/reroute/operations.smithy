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

@xOperationGroup("cluster.reroute")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_cluster/reroute")
@documentation("Allows to manually change the allocation of individual shards in the cluster.")
operation ClusterReroute {
    input: ClusterReroute_Input,
    output: ClusterReroute_Output
}
