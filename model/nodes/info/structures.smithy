// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure NodesInfo_QueryParams {
    @httpQuery("flat_settings")
    @default(false)
    flat_settings: FlatSettings,

    @httpQuery("timeout")
    timeout: Timeout,
}


@input
structure NodesInfo_Input with [NodesInfo_QueryParams] {
}

@input
structure NodesInfo_WithNodeId_Input with [NodesInfo_QueryParams] {
    @required
    @httpLabel
    @xOverloadedParam("metric")
    node_id: PathNodeId,
}

@input
structure NodesInfo_WithMetricNodeId_Input with [NodesInfo_QueryParams] {
    @required
    @httpLabel
    node_id: PathNodeId,

    @required
    @httpLabel
    metric: PathNodesInfoMetric,
}

// TODO: Fill in Output Structure
structure NodesInfo_Output {}
