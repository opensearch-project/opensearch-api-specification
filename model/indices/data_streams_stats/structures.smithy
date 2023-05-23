// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesDataStreamsStats_QueryParams {
}


@input
structure IndicesDataStreamsStats_Input with [IndicesDataStreamsStats_QueryParams] {
}

@input
structure IndicesDataStreamsStats_WithName_Input with [IndicesDataStreamsStats_QueryParams] {
    @required
    @httpLabel
    name: PathStreamNames,
}

// TODO: Fill in Output Structure
structure IndicesDataStreamsStats_Output {}
