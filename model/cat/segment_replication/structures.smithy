// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatSegmentReplication_QueryParams {
    @httpQuery("format")
    format: Format,

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

    @httpQuery("h")
    h: H,

    @httpQuery("help")
    @default(false)
    help: Help,

    @httpQuery("index")
    @documentation("Comma-separated list or wildcard expression of index names to limit the returned information.")
    query_index: Indices,

    @httpQuery("s")
    s: S,

    @httpQuery("time")
    time: Time,

    @httpQuery("v")
    @default(false)
    v: V,
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

// TODO: Fill in Output Structure
structure CatSegmentReplication_Output {}
