// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesRefresh_QueryParams {
    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,
}


@input
structure IndicesRefresh_Post_Input with [IndicesRefresh_QueryParams] {
}

@input
structure IndicesRefresh_Get_Input with [IndicesRefresh_QueryParams] {
}

@input
structure IndicesRefresh_Post_WithIndex_Input with [IndicesRefresh_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

@input
structure IndicesRefresh_Get_WithIndex_Input with [IndicesRefresh_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure IndicesRefresh_Output {}
