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
    analyzer: Analyzer,

    @httpQuery("analyze_wildcard")
    @default(false)
    analyze_wildcard: AnalyzeWildcard,

    @httpQuery("ccs_minimize_roundtrips")
    @default(true)
    ccs_minimize_roundtrips: CcsMinimizeRoundtrips,

    @httpQuery("default_operator")
    @default("OR")
    default_operator: DefaultOperator,

    @httpQuery("df")
    df: Df,

    @httpQuery("explain")
    @documentation("Specify whether to return detailed information about score computation as part of a hit.")
    explain: Explain,

    @httpQuery("stored_fields")
    stored_fields: StoredFields,

    @httpQuery("docvalue_fields")
    docvalue_fields: DocvalueFields,

    @httpQuery("from")
    @default(0)
    from: From,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("ignore_throttled")
    ignore_throttled: IgnoreThrottled,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("lenient")
    lenient: Lenient,

    @httpQuery("preference")
    @default("random")
    preference: Preference,

    @httpQuery("q")
    q: Q,

    @httpQuery("routing")
    routing: Routings,

    @httpQuery("scroll")
    scroll: Scroll,

    @httpQuery("search_type")
    search_type: SearchType,

    @httpQuery("size")
    @documentation("Number of hits to return.")
    @default(10)
    size: Size,

    @httpQuery("sort")
    sort: Sort,

    @httpQuery("_source")
    _source: Source,

    @httpQuery("_source_excludes")
    _source_excludes: SourceExcludes,

    @httpQuery("_source_includes")
    _source_includes: SourceIncludes,

    @httpQuery("terminate_after")
    terminate_after: TerminateAfter,

    @httpQuery("stats")
    stats: Stats,

    @httpQuery("suggest_field")
    suggest_field: SuggestField,

    @httpQuery("suggest_mode")
    @default("missing")
    suggest_mode: SuggestMode,

    @httpQuery("suggest_size")
    suggest_size: SuggestSize,

    @httpQuery("suggest_text")
    suggest_text: SuggestText,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("track_scores")
    track_scores: TrackScores,

    @httpQuery("track_total_hits")
    track_total_hits: TrackTotalHits,

    @httpQuery("allow_partial_search_results")
    @default(true)
    allow_partial_search_results: AllowPartialSearchResults,

    @httpQuery("typed_keys")
    typed_keys: TypedKeys,

    @httpQuery("version")
    version: WithVersion,

    @httpQuery("seq_no_primary_term")
    seq_no_primary_term: SeqNoPrimaryTerm,

    @httpQuery("request_cache")
    request_cache: RequestCache,

    @httpQuery("batched_reduce_size")
    @default(512)
    batched_reduce_size: BatchedReduceSize,

    @httpQuery("max_concurrent_shard_requests")
    @documentation("The number of concurrent shard requests per node this search executes concurrently. This value should be used to limit the impact of the search on the cluster in order to limit the number of concurrent shard requests.")
    @default(5)
    max_concurrent_shard_requests: MaxConcurrentShardRequests,

    @httpQuery("pre_filter_shard_size")
    pre_filter_shard_size: PreFilterShardSize,

    @httpQuery("rest_total_hits_as_int")
    @default(false)
    rest_total_hits_as_int: RestTotalHitsAsInt,
}

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
structure Search_Post_Input with [Search_QueryParams] {
    @httpPayload
    content: Search_BodyParams,
}

@input
structure Search_Get_WithIndex_Input with [Search_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

@input
structure Search_Post_WithIndex_Input with [Search_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
    @httpPayload
    content: Search_BodyParams,
}

structure Search_Output {
    _scroll_id: String,
    took: Long,
    timed_out: Boolean,
    _shards: ShardStatistics,
    hits: HitsMetadata
}
