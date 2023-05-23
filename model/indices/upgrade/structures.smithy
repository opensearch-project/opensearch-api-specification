// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesUpgrade_QueryParams {
    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("wait_for_completion")
    @default(false)
    wait_for_completion: WaitForCompletionFalse,

    @httpQuery("only_ancient_segments")
    only_ancient_segments: OnlyAncientSegments,
}


@input
structure IndicesUpgrade_Input with [IndicesUpgrade_QueryParams] {
}

@input
structure IndicesUpgrade_WithIndex_Input with [IndicesUpgrade_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure IndicesUpgrade_Output {}
