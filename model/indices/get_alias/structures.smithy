// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesGetAlias_QueryParams {
    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("all")
    expand_wildcards: ExpandWildcards,

    @httpQuery("local")
    @default(false)
    local: Local,
}


@input
structure IndicesGetAlias_Input with [IndicesGetAlias_QueryParams] {
}

@input
structure IndicesGetAlias_WithName_Input with [IndicesGetAlias_QueryParams] {
    @required
    @httpLabel
    name: PathAliasNames,
}

@input
structure IndicesGetAlias_WithIndexName_Input with [IndicesGetAlias_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to filter aliases.")
    index: PathIndices,

    @required
    @httpLabel
    name: PathAliasNames,
}

@input
structure IndicesGetAlias_WithIndex_Input with [IndicesGetAlias_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to filter aliases.")
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure IndicesGetAlias_Output {}
