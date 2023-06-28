// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/nodes-apis/nodes-info/"
)

@vendorExtensions(
    "x-operation-group": "nodes.info",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes")
@documentation("Returns information about nodes in the cluster.")
operation NodesInfo {
    input: NodesInfo_Input,
    output: NodesInfo_Output
}

@vendorExtensions(
    "x-operation-group": "nodes.info",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}")
@documentation("Returns information about nodes in the cluster.")
operation NodesInfo_WithNodeId {
    input: NodesInfo_WithNodeId_Input,
    output: NodesInfo_Output
}

@vendorExtensions(
    "x-operation-group": "nodes.info",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}/{metric}")
@documentation("Returns information about nodes in the cluster.")
operation NodesInfo_WithMetricNodeId {
    input: NodesInfo_WithMetricNodeId_Input,
    output: NodesInfo_Output
}
