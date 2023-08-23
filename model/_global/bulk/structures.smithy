// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Bulk_QueryParams {
    @httpQuery("wait_for_active_shards")
    @documentation("Sets the number of shard copies that must be active before proceeding with the operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1).")
    @default("1")
    wait_for_active_shards: WaitForActiveShards,

    @httpQuery("refresh")
    @default("false")
    refresh: RefreshEnum,

    @httpQuery("routing")
    routing: Routing,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("type")
    type: DocumentType,

    @httpQuery("_source")
    @documentation("True or false to return the _source field or not, or default list of fields to return, can be overridden on each sub-request.")
    _source: Source,

    @httpQuery("_source_excludes")
    @documentation("Default list of fields to exclude from the returned _source field, can be overridden on each sub-request.")
    _source_excludes: SourceExcludes,

    @httpQuery("_source_includes")
    @documentation("Default list of fields to extract and return from the _source field, can be overridden on each sub-request.")
    _source_includes: SourceIncludes,

    @httpQuery("pipeline")
    pipeline: Pipeline,

    @httpQuery("require_alias")
    @documentation("Sets require_alias for all incoming documents.")
    @default(false)
    require_alias: RequireAlias,
}

// TODO: Fill in Body Parameters
@xSerialize("bulk")
@documentation("The operation definition and data (action-data pairs), separated by newlines")
structure Bulk_BodyParams {}

@input
structure Bulk_Post_Input with [Bulk_QueryParams] {
    @required
    @httpPayload
    content: Bulk_BodyParams,
}

@input
structure Bulk_Put_Input with [Bulk_QueryParams] {
    @required
    @httpPayload
    content: Bulk_BodyParams,
}

@input
structure Bulk_Post_WithIndex_Input with [Bulk_QueryParams] {
    @required
    @httpLabel
    @documentation("Default index for items which don't provide one.")
    index: PathIndex,
    @required
    @httpPayload
    content: Bulk_BodyParams,
}

@input
structure Bulk_Put_WithIndex_Input with [Bulk_QueryParams] {
    @required
    @httpLabel
    @documentation("Default index for items which don't provide one.")
    index: PathIndex,
    @required
    @httpPayload
    content: Bulk_BodyParams,
}

// TODO: Fill in Output Structure
structure Bulk_Output {}
