// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatIndices_QueryParams {
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

    @httpQuery("health")
    health: Health,

    @httpQuery("help")
    @default(false)
    help: Help,

    @httpQuery("pri")
    @default(false)
    pri: Pri,

    @httpQuery("s")
    s: S,

    @httpQuery("time")
    time: Time,

    @httpQuery("v")
    @default(false)
    v: V,

    @httpQuery("include_unloaded_segments")
    @default(false)
    include_unloaded_segments: IncludeUnloadedSegments,

    @httpQuery("expand_wildcards")
    @default("all")
    expand_wildcards: ExpandWildcards,
}


@input
structure CatIndices_Input with [CatIndices_QueryParams] {
}

@input
structure CatIndices_WithIndex_Input with [CatIndices_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to limit the returned information.")
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure CatIndices_Output {
    // In the Cat Indices API, the dot operator is used to name a few fields.
    // Smithy does not yet support this naming standard.
    // It needs to be modified once we have support for the dot operator.
}
