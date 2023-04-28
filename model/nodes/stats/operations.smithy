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
    "x-operation-group": "nodes.stats",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/stats")
@documentation("Returns statistical information about nodes in the cluster.")
operation NodesStats {
    input: NodesStats_Input,
    output: NodesStats_Output
}

@vendorExtensions(
    "x-operation-group": "nodes.stats",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/stats/{metric}")
@documentation("Returns statistical information about nodes in the cluster.")
operation NodesStats_WithMetric {
    input: NodesStats_WithMetric_Input,
    output: NodesStats_Output
}

@vendorExtensions(
    "x-operation-group": "nodes.stats",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}/stats")
@documentation("Returns statistical information about nodes in the cluster.")
operation NodesStats_WithNodeId {
    input: NodesStats_WithNodeId_Input,
    output: NodesStats_Output
}

@vendorExtensions(
    "x-operation-group": "nodes.stats",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/stats/{metric}/{index_metric}")
@documentation("Returns statistical information about nodes in the cluster.")
operation NodesStats_WithIndexMetricMetric {
    input: NodesStats_WithIndexMetricMetric_Input,
    output: NodesStats_Output
}

@vendorExtensions(
    "x-operation-group": "nodes.stats",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}/stats/{metric}")
@documentation("Returns statistical information about nodes in the cluster.")
operation NodesStats_WithMetricNodeId {
    input: NodesStats_WithMetricNodeId_Input,
    output: NodesStats_Output
}

@vendorExtensions(
    "x-operation-group": "nodes.stats",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}/stats/{metric}/{index_metric}")
@documentation("Returns statistical information about nodes in the cluster.")
operation NodesStats_WithIndexMetricMetricNodeId {
    input: NodesStats_WithIndexMetricMetricNodeId_Input,
    output: NodesStats_Output
}
