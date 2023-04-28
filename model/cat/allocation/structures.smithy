// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatAllocation_QueryParams {
    @httpQuery("format")
    format: Format,

    @httpQuery("bytes")
    bytes: Bytes,

    @httpQuery("local")
    @default(false)
    local: Local,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("h")
    h: H,

    @httpQuery("help")
    @default(false)
    help: Help,

    @httpQuery("s")
    s: S,

    @httpQuery("v")
    @default(false)
    v: V,
}


@input
structure CatAllocation_Input with [CatAllocation_QueryParams] {
}

@input
structure CatAllocation_WithNodeId_Input with [CatAllocation_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of node IDs or names to limit the returned information.")
    node_id: PathNodeId,
}

// TODO: Fill in Output Structure
structure CatAllocation_Output {}
