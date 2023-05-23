// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure SearchTemplate_QueryParams {
    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("ignore_throttled")
    ignore_throttled: IgnoreThrottled,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("preference")
    @default("random")
    preference: Preference,

    @httpQuery("routing")
    routing: Routings,

    @httpQuery("scroll")
    scroll: Scroll,

    @httpQuery("search_type")
    search_type: SearchTypeMulti,

    @httpQuery("explain")
    @documentation("Specify whether to return detailed information about score computation as part of a hit.")
    explain: Explain,

    @httpQuery("profile")
    profile: Profile,

    @httpQuery("typed_keys")
    typed_keys: TypedKeys,

    @httpQuery("rest_total_hits_as_int")
    @default(false)
    rest_total_hits_as_int: RestTotalHitsAsInt,

    @httpQuery("ccs_minimize_roundtrips")
    @default(true)
    ccs_minimize_roundtrips: CcsMinimizeRoundtrips,
}

// TODO: Fill in Body Parameters
structure SearchTemplate_BodyParams {}

@input
structure SearchTemplate_Get_Input with [SearchTemplate_QueryParams] {
}

@input
structure SearchTemplate_Post_Input with [SearchTemplate_QueryParams] {
    @httpPayload
    content: SearchTemplate_BodyParams,
}

@input
structure SearchTemplate_Get_WithIndex_Input with [SearchTemplate_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

@input
structure SearchTemplate_Post_WithIndex_Input with [SearchTemplate_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
    @httpPayload
    content: SearchTemplate_BodyParams,
}

// TODO: Fill in Output Structure
structure SearchTemplate_Output {}
