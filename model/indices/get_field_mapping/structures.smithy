// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesGetFieldMapping_QueryParams {
    @httpQuery("include_defaults")
    @documentation("Whether the default mapping values should be returned as well.")
    include_defaults: IncludeDefaults,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("local")
    @default(false)
    local: Local,
}


@input
structure IndicesGetFieldMapping_Input with [IndicesGetFieldMapping_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of fields.")
    fields: PathFields,
}

@input
structure IndicesGetFieldMapping_WithIndex_Input with [IndicesGetFieldMapping_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices.")
    index: PathIndices,

    @required
    @httpLabel
    @documentation("Comma-separated list of fields.")
    fields: PathFields,
}

// TODO: Fill in Output Structure
structure IndicesGetFieldMapping_Output {}
