// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

structure PostSearchInput {

    // PostSearchInputCommonParameters Start
    @httpQuery("allow_no_indices")
    allow_no_indices: Boolean,

    @httpQuery("allow_partial_search_results")
    allow_partial_search_results: Boolean,

    @httpQuery("analyzer")
    analyzer: String,

    @httpQuery("analyze_wildcard")
    analyze_wildcard: Boolean,    

    @httpQuery("batched_reduce_size")
    batched_reduce_size: Integer,

    @httpQuery("ccs_minimize_roundtrips")
    ccs_minimize_roundtrips: Boolean,

    @httpQuery("default_operator")
    default_operators: DefaultOperator,

    @httpQuery("df")
    df: String,

    @httpQuery("docvalue_fields")
    docvalue_fields_query_parameter: String,

    @httpQuery("expand_wildcards")
    expand_wildcards: ExpandWildcards,

    @httpQuery("explain")
    explain_query_parameter: Boolean,

    @httpQuery("from")
    from_query_parameter: Integer,

    @httpQuery("ignore_throttled")
    ignore_throttled: Boolean,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: Boolean,

    @httpQuery("lenient")
    lenient: Boolean,

    @httpQuery("max_concurrent_shard_requests")
    max_concurrent_shard_requests: Long,

    @httpQuery("pre_filter_shard_size")
    pre_filter_shard_size: Long,

    @httpQuery("preference")
    preference: String,

    @httpQuery("q")
    q: String,

    @httpQuery("request_cache")
    request_cache: Boolean,

    @httpQuery("rest_total_hits_as_int")
    rest_total_hits_as_int: Boolean,

    @httpQuery("routing")
    routing: String,

    @httpQuery("scroll")
    scroll: Time,

    @httpQuery("search_type")
    search_type: SearchType,

    @httpQuery("seq_no_primary_term")
    seq_no_primary_term_query_parameter: Boolean,

    @httpQuery("size")
    size_query_parameter: Integer,

    @httpQuery("sort")
    sort: UserDefinedValueList,

    @httpQuery("source")
    source_query_parameter: String,    

    @httpQuery("source_excludes")
    source_excludes: UserDefinedValueList,

    @httpQuery("source_includes")
    source_includes: UserDefinedValueList,

    @httpQuery("stats")
    stats_query_parameter: String,

    @httpQuery("stored_fields")
    stored_fields: Boolean,

    @httpQuery("suggest_field")
    suggest_field: String,

    @httpQuery("suggest_mode")
    suggest_mode: SuggestMode,

    @httpQuery("suggest_size")
    suggest_size: Long,

    @httpQuery("suggest_text")
    suggest_text: String,

    @httpQuery("terminate_after")
    terminate_after_query_parameter: Integer,

    @httpQuery("timeout")
    timeout_query_parameter: Time,  

    @httpQuery("track_scores")
    track_scores: Boolean,

    @httpQuery("track_total_hits")
    track_total_hits: Integer,

    @httpQuery("typed_keys")
    typed_keys: Boolean,

    @httpQuery("version")
    version_query_parameter: Boolean,
    // PostSearchInputCommonParameters End

    // Request-body parameters 

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

structure PostSearchOutput {

    _scroll_id: String,

    took: Long,

    timed_out: Boolean,

    _shards: ShardStatistics,

    hits: HitsMetadata,
}


structure PostSearchWithIndexInput {
    @httpLabel
    @required
    index: IndexName,

    // PostSearchWithIndexInputCommonParameter Start
    @httpQuery("allow_no_indices")
    allow_no_indices: Boolean,

    @httpQuery("allow_partial_search_results")
    allow_partial_search_results: Boolean,

    @httpQuery("analyzer")
    analyzer: String,

    @httpQuery("analyze_wildcard")
    analyze_wildcard: Boolean,    

    @httpQuery("batched_reduce_size")
    batched_reduce_size: Integer,

    @httpQuery("ccs_minimize_roundtrips")
    ccs_minimize_roundtrips: Boolean,

    @httpQuery("default_operator")
    default_operators: DefaultOperator,

    @httpQuery("df")
    df: String,

    @httpQuery("docvalue_fields")
    docvalue_fields_query_parameter: String,

    @httpQuery("expand_wildcards")
    expand_wildcards: ExpandWildcards,

    @httpQuery("explain")
    explain_query_parameter: Boolean,

    @httpQuery("from")
    from_query_parameter: Integer,

    @httpQuery("ignore_throttled")
    ignore_throttled: Boolean,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: Boolean,

    @httpQuery("lenient")
    lenient: Boolean,

    @httpQuery("max_concurrent_shard_requests")
    max_concurrent_shard_requests: Long,

    @httpQuery("pre_filter_shard_size")
    pre_filter_shard_size: Long,

    @httpQuery("preference")
    preference: String,

    @httpQuery("q")
    q: String,

    @httpQuery("request_cache")
    request_cache: Boolean,

    @httpQuery("rest_total_hits_as_int")
    rest_total_hits_as_int: Boolean,

    @httpQuery("routing")
    routing: String,

    @httpQuery("scroll")
    scroll: Time,

    @httpQuery("search_type")
    search_type: SearchType,

    @httpQuery("seq_no_primary_term")
    seq_no_primary_term_query_parameter: Boolean,

    @httpQuery("size")
    size_query_parameter: Integer,

    @httpQuery("sort")
    sort: UserDefinedValueList,

    @httpQuery("source")
    source_query_parameter: String,    

    @httpQuery("source_excludes")
    source_excludes: UserDefinedValueList,

    @httpQuery("source_includes")
    source_includes: UserDefinedValueList,

    @httpQuery("stats")
    stats_query_parameter: String,

    @httpQuery("stored_fields")
    stored_fields: Boolean,

    @httpQuery("suggest_field")
    suggest_field: String,

    @httpQuery("suggest_mode")
    suggest_mode: SuggestMode,

    @httpQuery("suggest_size")
    suggest_size: Long,

    @httpQuery("suggest_text")
    suggest_text: String,

    @httpQuery("terminate_after")
    terminate_after_query_parameter: Integer,

    @httpQuery("timeout")
    timeout_query_parameter: Time,  

    @httpQuery("track_scores")
    track_scores: Boolean,

    @httpQuery("track_total_hits")
    track_total_hits: Integer,

    @httpQuery("typed_keys")
    typed_keys: Boolean,

    @httpQuery("version")
    version_query_parameter: Boolean,
    // PostSearchWithIndexInputCommonParameter End

    // Request-body parameters 

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
    query: UserDefinedObjectStructure,

}

structure PostSearchWithIndexOutput {

    @required
    index: IndexName,

    _scroll_id: String,

    took: Long,

    timed_out: Boolean,

    _shards: ShardStatistics,

    hits: HitsMetadata,
}
