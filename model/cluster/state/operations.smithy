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
    "x-operation-group": "cluster.state",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/state")
@documentation("Returns a comprehensive information about the state of the cluster.")
operation ClusterState {
    input: ClusterState_Input,
    output: ClusterState_Output
}

@vendorExtensions(
    "x-operation-group": "cluster.state",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/state/{metric}")
@documentation("Returns a comprehensive information about the state of the cluster.")
operation ClusterState_WithMetric {
    input: ClusterState_WithMetric_Input,
    output: ClusterState_Output
}

@vendorExtensions(
    "x-operation-group": "cluster.state",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/state/{metric}/{index}")
@documentation("Returns a comprehensive information about the state of the cluster.")
operation ClusterState_WithIndexMetric {
    input: ClusterState_WithIndexMetric_Input,
    output: ClusterState_Output
}
