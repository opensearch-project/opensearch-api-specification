// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ReloadSearchAnalyzer_QueryParams {
    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,
}

structure ReloadDetails {
  index: PathIndices,
  reloaded_analyzers: ReloadedAnalyzers,
  reloaded_node_ids: ReloadedNodeIds
}

list ReloadedAnalyzers {
    member: String
}

list ReloadedNodeIds {
    member: String
}

@input
structure ReloadSearchAnalyzer_Get_Input with [ReloadSearchAnalyzer_QueryParams]{
    @required
    @httpLabel
    index: PathIndices,
}

@input
structure ReloadSearchAnalyzer_Post_Input with [ReloadSearchAnalyzer_QueryParams]{
    @required
    @httpLabel
    index: PathIndices,
}

@output
structure ReloadSearchAnalyzer_Get_Output {
    _shards: ShardStatistics,

    reload_details: ReloadDetails
}

@output
structure ReloadSearchAnalyzer_Post_Output {
    _shards: ShardStatistics,

    reload_details: ReloadDetails
}
