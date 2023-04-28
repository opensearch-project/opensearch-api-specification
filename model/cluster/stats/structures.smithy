// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterStats_QueryParams {
    @httpQuery("flat_settings")
    @default(false)
    flat_settings: FlatSettings,

    @httpQuery("timeout")
    timeout: Timeout,
}


@input
structure ClusterStats_Input with [ClusterStats_QueryParams] {
}

@input
structure ClusterStats_WithNodeId_Input with [ClusterStats_QueryParams] {
    @required
    @httpLabel
    node_id: PathNodeId,
}

// TODO: Fill in Output Structure
structure ClusterStats_Output {}
