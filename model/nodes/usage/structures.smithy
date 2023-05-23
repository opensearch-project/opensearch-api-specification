// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure NodesUsage_QueryParams {
    @httpQuery("timeout")
    timeout: Timeout,
}


@input
structure NodesUsage_Input with [NodesUsage_QueryParams] {
}

@input
structure NodesUsage_WithMetric_Input with [NodesUsage_QueryParams] {
    @required
    @httpLabel
    metric: PathNodesUsageMetric,
}

@input
structure NodesUsage_WithNodeId_Input with [NodesUsage_QueryParams] {
    @required
    @httpLabel
    node_id: PathNodeId,
}

@input
structure NodesUsage_WithMetricNodeId_Input with [NodesUsage_QueryParams] {
    @required
    @httpLabel
    metric: PathNodesUsageMetric,

    @required
    @httpLabel
    node_id: PathNodeId,
}

// TODO: Fill in Output Structure
structure NodesUsage_Output {}
