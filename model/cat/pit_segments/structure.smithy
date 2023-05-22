// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure PitSegments {
    @documentation("The name of the index.")
    index: String,

    @documentation("The shard number.")
    shard: Integer,

    @documentation("The primary or replica designation.")
    prirep: String,

    @documentation("The IP address of the node where the segment resides.")
    ip: String,

    @documentation("The segment ID.")
    segment: String,

    @documentation("The generation number of the segment.")
    generation: Integer,

    @documentation("The number of documents in the segment.")
    docs_count: Integer,

    @documentation("The number of deleted documents in the segment.")
    docs_deleted: Integer,

    @documentation("The size of the segment on disk.")
    size: String,

    @documentation("The size of the segment in memory.")
    size_memory: Integer,

    @documentation("The committed status of the segment.")
    committed: Boolean,

    @documentation("The searchable status of the segment.")
    searchable: Boolean,

    @documentation("The version of OpenSearch.")
    version: String,

    @documentation("The compound status of the segment.")
    compound: Boolean,
}

@input
structure GetAllPitSegments_Input {
    @documentation("The PIT IDs of the PITs whose segments are to be listed.")
    pit_id: String
}



structure GetAllPitSegments_Output {
    @documentation("Information about the active point-in-time segments.")
    list: PitSegments
}