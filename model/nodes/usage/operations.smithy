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

@xOperationGroup("nodes.usage")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/usage")
@documentation("Returns low-level information about REST actions usage on nodes.")
operation NodesUsage {
    input: NodesUsage_Input,
    output: NodesUsage_Output
}

@xOperationGroup("nodes.usage")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/usage/{metric}")
@documentation("Returns low-level information about REST actions usage on nodes.")
operation NodesUsage_WithMetric {
    input: NodesUsage_WithMetric_Input,
    output: NodesUsage_Output
}

@xOperationGroup("nodes.usage")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}/usage")
@documentation("Returns low-level information about REST actions usage on nodes.")
operation NodesUsage_WithNodeId {
    input: NodesUsage_WithNodeId_Input,
    output: NodesUsage_Output
}

@xOperationGroup("nodes.usage")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}/usage/{metric}")
@documentation("Returns low-level information about REST actions usage on nodes.")
operation NodesUsage_WithMetricNodeId {
    input: NodesUsage_WithMetricNodeId_Input,
    output: NodesUsage_Output
}
