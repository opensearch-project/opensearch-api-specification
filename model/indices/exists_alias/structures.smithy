// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesExistsAlias_QueryParams {
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
structure IndicesExistsAlias_Input with [IndicesExistsAlias_QueryParams] {
    @required
    @httpLabel
    name: PathAliasNames,
}

@input
structure IndicesExistsAlias_WithIndex_Input with [IndicesExistsAlias_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to filter aliases.")
    index: PathIndices,

    @required
    @httpLabel
    name: PathAliasNames,
}

// TODO: Fill in Output Structure
structure IndicesExistsAlias_Output {}
