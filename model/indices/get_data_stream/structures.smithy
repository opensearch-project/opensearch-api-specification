// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesGetDataStream_QueryParams {
}

@input
structure IndicesGetDataStream_Input with [IndicesGetDataStream_QueryParams] {
}

@input
structure IndicesGetDataStream_WithName_Input with [IndicesGetDataStream_QueryParams] {
    @required
    @httpLabel
    name: PathStreamNames,
}

structure IndicesGetDataStream_Output {
    @httpPayload
    content: DataStreamMap
}
