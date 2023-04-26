// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@documentation("The unit in which to display byte values.")
enum Bytes {
    B = "b"
    K = "k"
    KB = "kb"
    M = "m"
    MB = "mb"
    G = "g"
    GB = "gb"
    T = "t"
    TB = "tb"
    P = "p"
    PB = "pb"
}

@documentation("Specify the level of detail for returned information.")
enum ClusterHealthLevel {
    CLUSTER = "cluster"
    INDICES = "indices"
    SHARDS = "shards"
    AWARENESS_ATTRIBUTES = "awareness_attributes"
}

@documentation("What to do when the operation encounters version conflicts?.")
enum Conflicts {
    ABORT = "abort"
    PROCEED = "proceed"
}

@documentation("The default operator for query string query (AND or OR).")
enum DefaultOperator {
    AND = "AND"
    OR = "OR"
}

@documentation("Whether to expand wildcard expression to concrete indices that are open, closed or both.")
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

@documentation("Group tasks by nodes or parent/child relationships.")
enum GroupBy {
    NODES = "nodes"
    PARENTS = "parents"
    NONE = "none"
}

@documentation("Health status ('green', 'yellow', or 'red') to filter only indices matching the specified health status.")
enum Health {
    GREEN = "green"
    YELLOW = "yellow"
    RED = "red"
}

@documentation("Return stats aggregated at cluster, index or shard level.")
enum IndiciesStatLevel {
    CLUSTER = "cluster"
    INDICES = "indices"
    SHARDS = "shards"
}

@documentation("Return indices stats aggregated at index, node or shard level.")
enum NodesStatLevel {
    INDICES = "indices"
    NODE = "node"
    SHARDS = "shards"
}

@documentation("Explicit operation type. Defaults to `index` for requests with an explicit document ID, and to `create`for requests without an explicit document ID.")
enum OpType {
    INDEX = "index"
    CREATE = "create"
}

@documentation("If `true` then refresh the affected shards to make this operation visible to search, if `wait_for` then wait for a refresh to make this operation visible to search, if `false` (the default) then do nothing with refreshes.")
enum RefreshEnum {
    TRUE = "true"
    FALSE = "false"
    WAIT_FOR = "wait_for"
}

@documentation("The type to sample.")
enum SampleType {
    CPU = "cpu"
    WAIT = "wait"
    BLOCK = "block"
}

@documentation("Search operation type.")
enum SearchType {
    @documentation("Documents are scored using local term and document frequencies for the shard. This is usually faster but less accurate.")
    QUERY_THEN_FETCH = "query_then_fetch"
    @documentation("Documents are scored using global term and document frequencies across all shards. This is usually slower but more accurate.")
    DFS_QUERY_THEN_FETCH = "dfs_query_then_fetch"
}

@documentation("Search operation type.")
enum SearchTypeMulti {
    QUERY_THEN_FETCH = "query_then_fetch"
    QUERY_AND_FETCH = "query_and_fetch"
    DFS_QUERY_THEN_FETCH = "dfs_query_then_fetch"
    DFS_QUERY_AND_FETCH = "dfs_query_and_fetch"
}

@documentation("Specify suggest mode.")
enum SuggestMode {
    MISSING = "missing"
    POPULAR = "popular"
    ALWAYS = "always"
}

@documentation("The unit in which to display time values.")
enum Time {
    D = "d"
    H = "h"
    M = "m"
    S = "s"
    MS = "ms"
    MICROS = "micros"
    NANOS = "nanos"
}

@documentation("Specific version type.")
enum VersionType {
    INTERNAL = "internal"
    EXTERNAL = "external"
    EXTERNAL_GTE = "external_gte"
    FORCE = "force"
}

@documentation("Wait until all currently queued events with the given priority are processed.")
enum WaitForEvents {
    IMMEDIATE = "immediate"
    URGENT = "urgent"
    HIGH = "high"
    NORMAL = "normal"
    LOW = "low"
    LANGUID = "languid"
}

@documentation("Wait until cluster is in a specific state.")
enum WaitForStatus {
    GREEN = "green"
    YELLOW = "yellow"
    RED = "red"
}
