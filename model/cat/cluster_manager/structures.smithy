// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatClusterManager_QueryParams {
    @httpQuery("format")
    format: Format,

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
structure CatClusterManager_Input with [CatClusterManager_QueryParams] {
}

@input
structure CatClusterManager_Input with [CatClusterManager_QueryParams] {
}

// TODO: Fill in Output Structure
structure CatClusterManager_Output {}
