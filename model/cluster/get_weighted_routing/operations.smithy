// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cluster-api/cluster-awareness/#example-getting-weights-for-all-zones"
)

@vendorExtensions(
    "x-operation-group": "cluster.get_weighted_routing",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/routing/awareness/{attribute}/weights")
@documentation("Fetches weighted shard routing weights.")
operation ClusterGetWeightedRouting {
    input: ClusterGetWeightedRouting_Input,
    output: ClusterGetWeightedRouting_Output
}
