// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure SearchShards_QueryParams {
    @httpQuery("preference")
    @default("random")
    preference: Preference,

    @httpQuery("routing")
    routing: Routing,

    @httpQuery("local")
    @default(false)
    local: Local,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,
}

// TODO: Fill in Body Parameters
structure SearchShards_BodyParams {}

@input
structure SearchShards_Get_Input with [SearchShards_QueryParams] {
}

@input
structure SearchShards_Post_Input with [SearchShards_QueryParams] {
    @httpPayload
    content: SearchShards_BodyParams,
}

@input
structure SearchShards_Get_WithIndex_Input with [SearchShards_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

@input
structure SearchShards_Post_WithIndex_Input with [SearchShards_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
    @httpPayload
    content: SearchShards_BodyParams,
}

// TODO: Fill in Output Structure
structure SearchShards_Output {}
