// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure MsearchTemplate_QueryParams {
    @httpQuery("search_type")
    search_type: SearchTypeMulti,

    @httpQuery("typed_keys")
    typed_keys: TypedKeys,

    @httpQuery("max_concurrent_searches")
    max_concurrent_searches: MaxConcurrentSearches,

    @httpQuery("rest_total_hits_as_int")
    @default(false)
    rest_total_hits_as_int: RestTotalHitsAsInt,

    @httpQuery("ccs_minimize_roundtrips")
    @default(true)
    ccs_minimize_roundtrips: CcsMinimizeRoundtrips,
}

// TODO: Fill in Body Parameters
structure MsearchTemplate_BodyParams {}

@input
structure MsearchTemplate_Get_Input with [MsearchTemplate_QueryParams] {
}

@input
structure MsearchTemplate_Post_Input with [MsearchTemplate_QueryParams] {
    @httpPayload
    content: MsearchTemplate_BodyParams,
}

@input
structure MsearchTemplate_Get_WithIndex_Input with [MsearchTemplate_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to use as default.")
    index: PathIndices,
}

@input
structure MsearchTemplate_Post_WithIndex_Input with [MsearchTemplate_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to use as default.")
    index: PathIndices,
    @httpPayload
    content: MsearchTemplate_BodyParams,
}

// TODO: Fill in Output Structure
structure MsearchTemplate_Output {}
