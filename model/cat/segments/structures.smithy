// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatSegments_QueryParams {
    @httpQuery("format")
    format: Format,

    @httpQuery("bytes")
    bytes: Bytes,

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
structure CatSegments_Input with [CatSegments_QueryParams] {
}

@input
structure CatSegments_WithIndex_Input with [CatSegments_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to limit the returned information.")
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure CatSegments_Output {}
