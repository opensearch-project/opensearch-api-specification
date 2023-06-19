// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Index_QueryParams {
    @httpQuery("wait_for_active_shards")
    @documentation("Sets the number of shard copies that must be active before proceeding with the operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1).")
    @default("1")
    wait_for_active_shards: WaitForActiveShards,

    @httpQuery("op_type")
    op_type: OpType,

    @httpQuery("refresh")
    @default("false")
    refresh: RefreshEnum,

    @httpQuery("routing")
    routing: Routing,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("version")
    version: Version,

    @httpQuery("version_type")
    version_type: VersionType,

    @httpQuery("if_seq_no")
    if_seq_no: IfSeqNo,

    @httpQuery("if_primary_term")
    if_primary_term: IfPrimaryTerm,

    @httpQuery("pipeline")
    pipeline: Pipeline,

    @httpQuery("require_alias")
    @default(false)
    require_alias: RequireAlias,
}

// TODO: Fill in Body Parameters
@documentation("The document")
structure Index_BodyParams {}

@input
structure Index_Post_Input with [Index_QueryParams] {
    @required
    @httpLabel
    index: PathIndex,
    @required
    @httpPayload
    content: Index_BodyParams,
}

@input
structure Index_Put_WithId_Input with [Index_QueryParams] {
    @required
    @httpLabel
    id: PathDocumentId,

    @required
    @httpLabel
    index: PathIndex,
    @required
    @httpPayload
    content: Index_BodyParams,
}

@input
structure Index_Post_WithId_Input with [Index_QueryParams] {
    @required
    @httpLabel
    id: PathDocumentId,

    @required
    @httpLabel
    index: PathIndex,
    @required
    @httpPayload
    content: Index_BodyParams,
}

// TODO: Fill in Output Structure
structure Index_Output {}
