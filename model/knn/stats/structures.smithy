// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure KNNStats_QueryParams {
    @httpQuery("timeout")
    timeout: Timeout,
}

@input
structure KNNStats_Input with [KNNStats_QueryParams] {
}

@input
structure KNNStats_WithNodeId_Input with [KNNStats_QueryParams] {
    @required
    @httpLabel
    node_id: PathNodeId,
}

@input
structure KNNStats_WithStat_Input with [KNNStats_QueryParams] {
    @required
    @httpLabel
    stat: PathStats,
}

@input
structure KNNStats_WithStatNodeId_Input with [KNNStats_QueryParams] {
    @required
    @httpLabel
    node_id: PathNodeId,

    @required
    @httpLabel
    stat: PathStats,
}

// TODO: Fill in Output Structure
structure KNNStats_Output{}
