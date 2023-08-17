// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/nodes-apis/nodes-info/"
)

@xOperationGroup("nodes.info")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes")
@documentation("Returns information about nodes in the cluster.")
operation NodesInfo {
    input: NodesInfo_Input,
    output: NodesInfo_Output
}

@xOperationGroup("nodes.info")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}")
@documentation("Returns information about nodes in the cluster.")
operation NodesInfo_WithNodeId {
    input: NodesInfo_WithNodeId_Input,
    output: NodesInfo_Output
}

@xOperationGroup("nodes.info")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}/{metric}")
@documentation("Returns information about nodes in the cluster.")
operation NodesInfo_WithMetricNodeId {
    input: NodesInfo_WithMetricNodeId_Input,
    output: NodesInfo_Output
}
