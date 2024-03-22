// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesForcemerge_QueryParams {
    @httpQuery("flush")
    @default(true)
    flush: Flush,

    @httpQuery("primary_only")
    @default(false)
    primary_only: PrimaryOnly,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("max_num_segments")
    max_num_segments: MaxNumSegments,

    @httpQuery("only_expunge_deletes")
    only_expunge_deletes: OnlyExpungeDeletes,

    @httpQuery("wait_for_completion")
    @default(true)
    wait_for_completion: WaitForCompletionTrue,
}


@input
structure IndicesForcemerge_Input with [IndicesForcemerge_QueryParams] {
}

@input
structure IndicesForcemerge_WithIndex_Input with [IndicesForcemerge_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure IndicesForcemerge_Output {}
