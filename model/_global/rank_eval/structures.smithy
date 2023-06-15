// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure RankEval_QueryParams {
    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("search_type")
    search_type: SearchType,
}

// TODO: Fill in Body Parameters
@documentation("The ranking evaluation search definition, including search requests, document ratings and ranking metric definition.")
structure RankEval_BodyParams {}

@input
structure RankEval_Get_Input with [RankEval_QueryParams] {
}

@input
structure RankEval_Post_Input with [RankEval_QueryParams] {
    @required
    @httpPayload
    content: RankEval_BodyParams,
}

@input
structure RankEval_Get_WithIndex_Input with [RankEval_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

@input
structure RankEval_Post_WithIndex_Input with [RankEval_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
    @required
    @httpPayload
    content: RankEval_BodyParams,
}

// TODO: Fill in Output Structure
structure RankEval_Output {}
