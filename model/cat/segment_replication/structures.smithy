// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatSegmentReplication_QueryParams with [
    CommonCatQueryParams,
    IndicesOptionsQueryParams,
] {
    @httpQuery("active_only")
    @documentation("If `true`, the response only includes ongoing segment replication events.")
    @default(false)
    active_only: ActiveOnly,

    @httpQuery("completed_only")
    @default(false)
    completed_only: CompletedOnly,

    @httpQuery("bytes")
    bytes: Bytes,

    @httpQuery("detailed")
    @documentation("If `true`, the response includes detailed information about segment replications.")
    @default(false)
    detailed: Detailed,

    @httpQuery("shards")
    shards: Shards,

    @httpQuery("index")
    @documentation("Comma-separated list or wildcard expression of index names to limit the returned information.")
    query_index: Indices,

    @httpQuery("time")
    time: Time,

    @httpQuery("timeout")
    timeout: Timeout,
}


@input
structure CatSegmentReplication_Input with [CatSegmentReplication_QueryParams] {
}

@input
structure CatSegmentReplication_WithIndex_Input with [CatSegmentReplication_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list or wildcard expression of index names to limit the returned information.")
    index: PathIndices,
}

structure CatSegmentReplication_Output {
    @httpPayload
    content: CatSegmentReplicationRecords
}

list CatSegmentReplicationRecords {
    member: CatSegmentReplicationRecord
}

structure CatSegmentReplicationRecord {
    shardId: String,
    target_node: String,
    target_host: String,
    checkpoints_behind: String,
    bytes_behind: String,
    current_lag: String,
    last_completed_lag: String,
    rejected_requests: String,

    stage: String,
    time: String,
    files_fetched: String,
    files_percent: String,
    bytes_fetched: String,
    bytes_percent: String,
    start_time: String,
    stop_time: String,
    files: String,
    files_total: String,
    bytes: String,
    bytes_total: String,
    replicating_stage_time_taken: String,
    get_checkpoint_info_stage_time_taken: String,
    file_diff_stage_time_taken: String,
    get_files_stage_time_taken: String,
    finalize_replication_stage_time_taken: String,
}
