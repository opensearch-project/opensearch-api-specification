// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesDeleteDataStream_QueryParams {
}


@input
structure IndicesDeleteDataStream_Input with [IndicesDeleteDataStream_QueryParams] {
    @required
    @httpLabel
    name: PathStreamNames,
}

structure IndicesDeleteDataStream_Output {
    acknowledged: Boolean
}
