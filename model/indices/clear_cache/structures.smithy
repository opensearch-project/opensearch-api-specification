// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesClearCache_QueryParams {
    @httpQuery("fielddata")
    fielddata: Fielddata,

    @httpQuery("fields")
    @documentation("Comma-separated list of fields to clear when using the `fielddata` parameter (default: all).")
    fields: Fields,

    @httpQuery("query")
    query: Query,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("index")
    query_index: Indices,

    @httpQuery("request")
    request: Request,
}

// TODO: Fill in Body Parameters
structure IndicesClearCache_BodyParams {}

@input
structure IndicesClearCache_Input with [IndicesClearCache_QueryParams] {
    @httpPayload
    content: IndicesClearCache_BodyParams,
}

@input
structure IndicesClearCache_WithIndex_Input with [IndicesClearCache_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
    @httpPayload
    content: IndicesClearCache_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesClearCache_Output {}
