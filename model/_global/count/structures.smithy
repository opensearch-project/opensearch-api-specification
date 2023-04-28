// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Count_QueryParams {
    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("ignore_throttled")
    ignore_throttled: IgnoreThrottled,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("min_score")
    min_score: MinScore,

    @httpQuery("preference")
    @default("random")
    preference: Preference,

    @httpQuery("routing")
    routing: Routings,

    @httpQuery("q")
    q: Q,

    @httpQuery("analyzer")
    analyzer: Analyzer,

    @httpQuery("analyze_wildcard")
    @default(false)
    analyze_wildcard: AnalyzeWildcard,

    @httpQuery("default_operator")
    @default("OR")
    default_operator: DefaultOperator,

    @httpQuery("df")
    df: Df,

    @httpQuery("lenient")
    lenient: Lenient,

    @httpQuery("terminate_after")
    terminate_after: TerminateAfter,
}

// TODO: Fill in Body Parameters
structure Count_BodyParams {}

@input
structure Count_Post_Input with [Count_QueryParams] {
    @httpPayload
    content: Count_BodyParams,
}

@input
structure Count_Get_Input with [Count_QueryParams] {
}

@input
structure Count_Post_WithIndex_Input with [Count_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to restrict the results.")
    index: PathIndices,
    @httpPayload
    content: Count_BodyParams,
}

@input
structure Count_Get_WithIndex_Input with [Count_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to restrict the results.")
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure Count_Output {}
