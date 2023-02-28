// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

enum ExpandWildcards {
    @documentation("Match any data stream or index, including hidden ones.")
    ALL = "all"
    @documentation("Match open, non-hidden indices. Also matches any non-hidden data stream.")
    OPEN = "open"
    @documentation("Match closed, non-hidden indices. Also matches any non-hidden data stream. Data streams cannot be closed.")
    CLOSED = "closed"
    @documentation("Match hidden data streams and hidden indices. Must be combined with open, closed, or both.")
    HIDDEN = "hidden"
    @documentation("Wildcard expressions are not accepted.")
    NONE = "none"
}

enum DefaultOperator {
    AND = "AND"
    OR = "OR"
}

enum SearchType {
    @documentation("Documents are scored using local term and document frequencies for the shard. This is usually faster but less accurate.")
    QUERY_THEN_FETCH = "query_then_fetch"
    @documentation("Documents are scored using global term and document frequencies across all shards. This is usually slower but more accurate.")
    DFS_QUERY_THEN_FETCH = "dfs_query_then_fetch"
}

enum SuggestMode {
    MISSING = "missing"
    POPULAR = "popular"
    ALWAYS = "always"
}

enum VersionType {
    INTERNAL = "internal"
    EXTERNAL = "external"
    EXTERNAL_GTE = "external_gte"
}

enum HealthStatus {
    GREEN = "green"
    YELLOW = "yellow"
    RED = "red"
}

enum Relation {
    @documentation("Accurate")
    EQ = "eq"
    @documentation("Lower bound, including returned documents")
    GTE = "gte"
}
