// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure DataStream{
    name: String,
    timestamp_field: DataStreamTimestampField,
    indices: DataStreamIndices,
    generation: Integer,
    status: String,
    template: String
}

list DataStreamIndices {
    member: DataStreamIndex
}

structure DataStreamIndex {
  index_name: String,
  index_uuid: String
}

map DataStreamTimestampField {
  key: String
  value: String
}

map DataStreamMap {
    key: String
    value: DataStreamList
}

list DataStreamList {
    member: DataStream
}
