// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesFlush_QueryParams {
    @httpQuery("force")
    force: Force,

    @httpQuery("wait_if_ongoing")
    @default(true)
    wait_if_ongoing: WaitIfOngoing,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,
}

// TODO: Fill in Body Parameters
structure IndicesFlush_BodyParams {}

@input
structure IndicesFlush_Post_Input with [IndicesFlush_QueryParams] {
    @httpPayload
    content: IndicesFlush_BodyParams,
}

@input
structure IndicesFlush_Get_Input with [IndicesFlush_QueryParams] {
}

@input
structure IndicesFlush_Post_WithIndex_Input with [IndicesFlush_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
    @httpPayload
    content: IndicesFlush_BodyParams,
}

@input
structure IndicesFlush_Get_WithIndex_Input with [IndicesFlush_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure IndicesFlush_Output {}
