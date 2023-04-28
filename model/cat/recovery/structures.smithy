// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatRecovery_QueryParams {
    @httpQuery("format")
    format: Format,

    @httpQuery("active_only")
    @documentation("If `true`, the response only includes ongoing shard recoveries.")
    @default(false)
    active_only: ActiveOnly,

    @httpQuery("bytes")
    bytes: Bytes,

    @httpQuery("detailed")
    @documentation("If `true`, the response includes detailed information about shard recoveries.")
    @default(false)
    detailed: Detailed,

    @httpQuery("h")
    h: H,

    @httpQuery("help")
    @default(false)
    help: Help,

    @httpQuery("index")
    @documentation("Comma-separated list or wildcard expression of index names to limit the returned information.")
    index: Indices,

    @httpQuery("s")
    s: S,

    @httpQuery("time")
    time: Time,

    @httpQuery("v")
    @default(false)
    v: V,
}


@input
structure CatRecovery_Input with [CatRecovery_QueryParams] {
}

@input
structure CatRecovery_WithIndex_Input with [CatRecovery_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list or wildcard expression of index names to limit the returned information.")
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure CatRecovery_Output {}
