// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterManagerTimeout {
    @deprecated(since: "2.0.0", message: "To promote inclusive language, use 'cluster_manager_timeout' instead.")
    @httpQuery("master_timeout")
    master_timeout: Time,

    @since("2.0.0")
    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: Time,
}

structure ShardStatistics{
    total: Integer,
    successful: Integer,
    skipped: Integer,
    failed: Integer
}

structure HitsMetadata{
    total: Total,
    max_score: Double,
    hits: ListHits
}

structure Total{
    value:Integer,
    relation: Relation,
}

structure Hits{
    _index: String,
    _type: String,
    _id: String,
    _score: Float,
    _source: Document,
    fields: Document
}
