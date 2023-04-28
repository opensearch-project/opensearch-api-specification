// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesResolveIndex_QueryParams {
    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,
}


@input
structure IndicesResolveIndex_Input with [IndicesResolveIndex_QueryParams] {
    @required
    @httpLabel
    name: PathIndexNames,
}

// TODO: Fill in Output Structure
structure IndicesResolveIndex_Output {}
