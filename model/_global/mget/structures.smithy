// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Mget_QueryParams {
    @httpQuery("stored_fields")
    stored_fields: StoredFields,

    @httpQuery("preference")
    @default("random")
    preference: Preference,

    @httpQuery("realtime")
    realtime: Realtime,

    @httpQuery("refresh")
    @documentation("Refresh the shard containing the document before performing the operation.")
    refresh: RefreshBoolean,

    @httpQuery("routing")
    routing: Routing,

    @httpQuery("_source")
    _source: Source,

    @httpQuery("_source_excludes")
    _source_excludes: SourceExcludes,

    @httpQuery("_source_includes")
    _source_includes: SourceIncludes,
}

// TODO: Fill in Body Parameters
structure Mget_BodyParams {}

@input
structure Mget_Get_Input with [Mget_QueryParams] {
}

@input
structure Mget_Post_Input with [Mget_QueryParams] {
    @required
    @httpPayload
    content: Mget_BodyParams,
}

@input
structure Mget_Get_WithIndex_Input with [Mget_QueryParams] {
    @required
    @httpLabel
    index: PathIndex,
}

@input
structure Mget_Post_WithIndex_Input with [Mget_QueryParams] {
    @required
    @httpLabel
    index: PathIndex,
    @required
    @httpPayload
    content: Mget_BodyParams,
}

// TODO: Fill in Output Structure
structure Mget_Output {}
