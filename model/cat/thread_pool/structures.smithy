// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatThreadPool_QueryParams {
    @httpQuery("format")
    format: Format,

    @httpQuery("size")
    @documentation("The multiplier in which to display values.")
    size: Size,

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
structure CatThreadPool_Input with [CatThreadPool_QueryParams] {
}

@input
structure CatThreadPool_WithThreadPoolPatterns_Input with [CatThreadPool_QueryParams] {
    @required
    @httpLabel
    thread_pool_patterns: PathThreadPoolPatterns,
}

// TODO: Fill in Output Structure
structure CatThreadPool_Output {}
