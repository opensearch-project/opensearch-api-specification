// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure DeleteByQuery_QueryParams {
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

    @httpQuery("from")
    @default(0)
    from: From,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("conflicts")
    @default("abort")
    conflicts: Conflicts,

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

    @httpQuery("search_timeout")
    search_timeout: SearchTimeout,

    @httpQuery("size")
    @documentation("Deprecated, please use `max_docs` instead.")
    size: Size,

    @httpQuery("max_docs")
    max_docs: MaxDocs,

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

    @httpQuery("version")
    version: WithVersion,

    @httpQuery("request_cache")
    request_cache: RequestCache,

    @httpQuery("refresh")
    @documentation("Refresh the shard containing the document before performing the operation.")
    refresh: RefreshBoolean,

    @httpQuery("timeout")
    @default("1m")
    timeout: BulkTimeout,

    @httpQuery("wait_for_active_shards")
    @documentation("Sets the number of shard copies that must be active before proceeding with the operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1).")
    @default("1")
    wait_for_active_shards: WaitForActiveShards,

    @httpQuery("scroll_size")
    @default(100)
    scroll_size: ScrollSize,

    @httpQuery("wait_for_completion")
    @default(true)
    wait_for_completion: WaitForCompletionTrue,

    @httpQuery("requests_per_second")
    @default(0)
    requests_per_second: RequestsPerSecond,

    @httpQuery("slices")
    @default("1")
    slices: Slices,
}

// TODO: Fill in Body Parameters
structure DeleteByQuery_BodyParams {}

@input
structure DeleteByQuery_Input with [DeleteByQuery_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
    @httpPayload
    content: DeleteByQuery_BodyParams,
}

// TODO: Fill in Output Structure
structure DeleteByQuery_Output {}
