// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesSegments_QueryParams {
    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("verbose")
    @documentation("Includes detailed memory usage by Lucene.")
    @default(false)
    verbose: Verbose,
}


@input
structure IndicesSegments_Input with [IndicesSegments_QueryParams] {
}

@input
structure IndicesSegments_WithIndex_Input with [IndicesSegments_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure IndicesSegments_Output {}
