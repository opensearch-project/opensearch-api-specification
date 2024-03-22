// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatPitSegments_QueryParams with [CommonCatQueryParams] {
    @httpQuery("bytes")
    bytes: Bytes
}

structure CatPitSegments_BodyParams {
    @required
    pit_id: PitIds
}

list PitIds{
    member: String
}

@input
structure CatPitSegments_Input with [CatPitSegments_QueryParams] {
    @httpPayload
    content: CatPitSegments_BodyParams
}

@input
structure CatAllPitSegments_Input with [CatPitSegments_QueryParams] {
}

@output
structure CatPitSegments_Output {
    @httpPayload
    content: CatPitSegmentsRecords
}

@output
structure CatAllPitSegments_Output {
    @httpPayload
    content: CatPitSegmentsRecords
}

list CatPitSegmentsRecords {
    member: CatPitSegmentsRecord
}

structure CatPitSegmentsRecord {
    index: String,
    shard: String,
    prirep: String,
    ip: String,
    segment: String,
    generation: String,
    @jsonName("docs.count")
    docs_count: String,
    @jsonName("docs.deleted")
    docs_deleted: String,
    size: String,
    @jsonName("size.memory")
    size_memory: String,
    committed: String,
    searchable: String,
    version: String,
    compound: String,
}
