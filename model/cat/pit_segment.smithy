// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure CatPitSegment {
    index: Index,
    shard: Integer,
    prirep: Pri,
    ip: String,
    segment: String ,
    generation: Integer,
    docs_count: Integer,
    docs_deleted: Integer,
    size: String,
    size_memory: Size,
    committed: Boolean,
    searchable: Boolean,
    version: String,
    compound: Boolean,
}
