// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure FieldCaps_QueryParams {
    @httpQuery("fields")
    @documentation("Comma-separated list of field names.")
    fields: Fields,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("include_unmapped")
    @default(false)
    include_unmapped: IncludeUnmapped,
}

// TODO: Fill in Body Parameters
@documentation("An index filter specified with the Query DSL")
structure FieldCaps_BodyParams {}

@input
structure FieldCaps_Get_Input with [FieldCaps_QueryParams] {
}

@input
structure FieldCaps_Post_Input with [FieldCaps_QueryParams] {
    @httpPayload
    content: FieldCaps_BodyParams,
}

@input
structure FieldCaps_Get_WithIndex_Input with [FieldCaps_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

@input
structure FieldCaps_Post_WithIndex_Input with [FieldCaps_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
    @httpPayload
    content: FieldCaps_BodyParams,
}

// TODO: Fill in Output Structure
structure FieldCaps_Output {}
