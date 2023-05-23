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
    "API Reference": "https://opensearch.org/docs/latest"
)

@vendorExtensions(
    "x-operation-group": "cluster.put_weighted_routing",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_cluster/routing/awareness/{attribute}/weights")
@documentation("Updates weighted shard routing weights.")
operation ClusterPutWeightedRouting {
    input: ClusterPutWeightedRouting_Input,
    output: ClusterPutWeightedRouting_Output
}
