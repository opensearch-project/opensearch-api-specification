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
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cluster-api/cluster-health/"
)

@vendorExtensions(
    "x-operation-group": "cluster.health",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/health")
@documentation("Returns basic information about the health of the cluster.")
operation ClusterHealth {
    input: ClusterHealth_Input,
    output: ClusterHealth_Output
}

@vendorExtensions(
    "x-operation-group": "cluster.health",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/health/{index}")
@documentation("Returns basic information about the health of the cluster.")
operation ClusterHealth_WithIndex {
    input: ClusterHealth_WithIndex_Input,
    output: ClusterHealth_Output
}
