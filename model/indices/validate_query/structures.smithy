// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesValidateQuery_QueryParams {
    @httpQuery("explain")
    @documentation("Return detailed information about the error.")
    explain: Explain,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

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

    @httpQuery("rewrite")
    rewrite: Rewrite,

    @httpQuery("all_shards")
    all_shards: AllShards,
}

// TODO: Fill in Body Parameters
@documentation("The query definition specified with the Query DSL")
structure IndicesValidateQuery_BodyParams {}

@input
structure IndicesValidateQuery_Get_Input with [IndicesValidateQuery_QueryParams] {
}

@input
structure IndicesValidateQuery_Post_Input with [IndicesValidateQuery_QueryParams] {
    @httpPayload
    content: IndicesValidateQuery_BodyParams,
}

@input
structure IndicesValidateQuery_Get_WithIndex_Input with [IndicesValidateQuery_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

@input
structure IndicesValidateQuery_Post_WithIndex_Input with [IndicesValidateQuery_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
    @httpPayload
    content: IndicesValidateQuery_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesValidateQuery_Output {}
