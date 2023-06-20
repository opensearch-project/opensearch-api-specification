// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesCreateDataStream_QueryParams {
}

// TODO: Fill in Body Parameters
@documentation("The data stream definition")
structure IndicesCreateDataStream_BodyParams {}

@input
structure IndicesCreateDataStream_Input with [IndicesCreateDataStream_QueryParams] {
    @required
    @httpLabel
    name: PathStreamName,
    @httpPayload
    content: IndicesCreateDataStream_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesCreateDataStream_Output {}
