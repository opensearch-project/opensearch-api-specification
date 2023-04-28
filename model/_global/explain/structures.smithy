// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Explain_QueryParams {
    @httpQuery("analyze_wildcard")
    @documentation("Specify whether wildcards and prefix queries in the query string query should be analyzed.")
    @default(false)
    analyze_wildcard: AnalyzeWildcard,

    @httpQuery("analyzer")
    analyzer: Analyzer,

    @httpQuery("default_operator")
    @default("OR")
    default_operator: DefaultOperator,

    @httpQuery("df")
    @default("_all")
    df: DfExplain,

    @httpQuery("stored_fields")
    stored_fields: StoredFields,

    @httpQuery("lenient")
    lenient: Lenient,

    @httpQuery("preference")
    @default("random")
    preference: Preference,

    @httpQuery("q")
    q: Q,

    @httpQuery("routing")
    routing: Routing,

    @httpQuery("_source")
    _source: Source,

    @httpQuery("_source_excludes")
    _source_excludes: SourceExcludes,

    @httpQuery("_source_includes")
    _source_includes: SourceIncludes,
}

// TODO: Fill in Body Parameters
structure Explain_BodyParams {}

@input
structure Explain_Get_Input with [Explain_QueryParams] {
    @required
    @httpLabel
    id: PathDocumentId,

    @required
    @httpLabel
    index: PathIndex,
}

@input
structure Explain_Post_Input with [Explain_QueryParams] {
    @required
    @httpLabel
    id: PathDocumentId,

    @required
    @httpLabel
    index: PathIndex,
    @httpPayload
    content: Explain_BodyParams,
}

// TODO: Fill in Output Structure
structure Explain_Output {}
