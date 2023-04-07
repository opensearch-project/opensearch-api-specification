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
    query_format: Format,

    @httpQuery("bytes")
    query_bytes: Bytes,

    @httpQuery("local")
    @default(false)
    query_local: Local,

    @httpQuery("master_timeout")
    query_master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    query_cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("h")
    query_h: H,

    @httpQuery("health")
    query_health: Health,

    @httpQuery("help")
    @default(false)
    query_help: Help,

    @httpQuery("pri")
    @default(false)
    query_pri: Pri,

    @httpQuery("s")
    query_s: S,

    @httpQuery("time")
    query_time: Time,

    @httpQuery("v")
    @default(false)
    query_v: V,

    @httpQuery("include_unloaded_segments")
    @default(false)
    query_include_unloaded_segments: IncludeUnloadedSegments,

    @httpQuery("expand_wildcards")
    @default("all")
    query_expand_wildcards: ExpandWildcards,
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

    @httpPayload
    content: Document
}
