// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Search_QueryParams {
    @httpQuery("analyzer")
    query_analyzer: Analyzer,

    @httpQuery("analyze_wildcard")
    @default(false)
    query_analyze_wildcard: AnalyzeWildcard,

    @httpQuery("ccs_minimize_roundtrips")
    @default(true)
    query_ccs_minimize_roundtrips: CcsMinimizeRoundtrips,

    @httpQuery("default_operator")
    @default("OR")
    query_default_operator: DefaultOperator,

    @httpQuery("df")
    query_df: Df,

    @httpQuery("explain")
    @documentation("Specify whether to return detailed information about score computation as part of a hit.")
    query_explain: Explain,

    @httpQuery("stored_fields")
    query_stored_fields: StoredFields,

    @httpQuery("docvalue_fields")
    query_docvalue_fields: DocvalueFields,

    @httpQuery("from")
    @default(0)
    query_from: From,

    @httpQuery("ignore_unavailable")
    query_ignore_unavailable: IgnoreUnavailable,

    @httpQuery("ignore_throttled")
    query_ignore_throttled: IgnoreThrottled,

    @httpQuery("allow_no_indices")
    query_allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    query_expand_wildcards: ExpandWildcards,

    @httpQuery("lenient")
    query_lenient: Lenient,

    @httpQuery("preference")
    @default("random")
    query_preference: Preference,

    @httpQuery("q")
    query_q: Q,

    @httpQuery("routing")
    query_routing: Routings,

    @httpQuery("scroll")
    query_scroll: Scroll,

    @httpQuery("search_type")
    query_search_type: SearchType,

    @httpQuery("size")
    @documentation("Number of hits to return.")
    @default(10)
    query_size: Size,

    @httpQuery("sort")
    query_sort: Sort,

    @httpQuery("_source")
    query__source: Source,

    @httpQuery("_source_excludes")
    query__source_excludes: SourceExcludes,

    @httpQuery("_source_includes")
    query__source_includes: SourceIncludes,

    @httpQuery("terminate_after")
    query_terminate_after: TerminateAfter,

    @httpQuery("stats")
    query_stats: Stats,

    @httpQuery("suggest_field")
    query_suggest_field: SuggestField,

    @httpQuery("suggest_mode")
    @default("missing")
    query_suggest_mode: SuggestMode,

    @httpQuery("suggest_size")
    query_suggest_size: SuggestSize,

    @httpQuery("suggest_text")
    query_suggest_text: SuggestText,

    @httpQuery("timeout")
    query_timeout: Timeout,

    @httpQuery("track_scores")
    query_track_scores: TrackScores,

    @httpQuery("track_total_hits")
    query_track_total_hits: TrackTotalHits,

    @httpQuery("allow_partial_search_results")
    @default(true)
    query_allow_partial_search_results: AllowPartialSearchResults,

    @httpQuery("typed_keys")
    query_typed_keys: TypedKeys,

    @httpQuery("version")
    query_version: WithVersion,

    @httpQuery("seq_no_primary_term")
    query_seq_no_primary_term: SeqNoPrimaryTerm,

    @httpQuery("request_cache")
    query_request_cache: RequestCache,

    @httpQuery("batched_reduce_size")
    @default(512)
    query_batched_reduce_size: BatchedReduceSize,

    @httpQuery("max_concurrent_shard_requests")
    @documentation("The number of concurrent shard requests per node this search executes concurrently. This value should be used to limit the impact of the search on the cluster in order to limit the number of concurrent shard requests.")
    @default(5)
    query_max_concurrent_shard_requests: MaxConcurrentShardRequests,

    @httpQuery("pre_filter_shard_size")
    query_pre_filter_shard_size: PreFilterShardSize,

    @httpQuery("rest_total_hits_as_int")
    @default(false)
    query_rest_total_hits_as_int: RestTotalHitsAsInt,
}

@mixin
structure Search_BodyParams {
    docvalue_fields: String,
    explain: Boolean,
    from: Integer,
    seq_no_primary_term: Boolean,
    size: Integer,
    source: String,
    stats: String,
    terminate_after: Integer,
    timeout: Time,
    version: Boolean,
    fields: UserDefinedValueList,
    min_score: Integer,
    indices_boost: UserDefinedObjectList,
    query: UserDefinedObjectStructure
}

@input
structure Search_Get_Input with [Search_QueryParams] {
}

@input
structure Search_Post_Input with [Search_QueryParams, Search_BodyParams] {
}

@input
structure Search_Get_WithIndex_Input with [Search_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

@input
structure Search_Post_WithIndex_Input with [Search_QueryParams, Search_BodyParams] {
    @required
    @httpLabel
    index: PathIndices,
}

structure Search_Output {
    _scroll_id: String,

    took: Long,

    timed_out: Boolean,

    _shards: ShardStatistics,

    hits: HitsMetadata
}
