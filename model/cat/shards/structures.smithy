// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatShards_QueryParams {
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

    @httpQuery("time")
    time: Time,

    @httpQuery("v")
    @default(false)
    v: V,
}


@input
structure CatShards_Input with [CatShards_QueryParams] {
}

@input
structure CatShards_WithIndex_Input with [CatShards_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to limit the returned information.")
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure CatShards_Output {}
