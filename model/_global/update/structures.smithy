// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Update_QueryParams {
    @httpQuery("wait_for_active_shards")
    @documentation("Sets the number of shard copies that must be active before proceeding with the operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1).")
    @default("1")
    wait_for_active_shards: WaitForActiveShards,

    @httpQuery("_source")
    _source: Source,

    @httpQuery("_source_excludes")
    _source_excludes: SourceExcludes,

    @httpQuery("_source_includes")
    _source_includes: SourceIncludes,

    @httpQuery("lang")
    @default("painless")
    lang: Lang,

    @httpQuery("refresh")
    @default("false")
    refresh: RefreshEnum,

    @httpQuery("retry_on_conflict")
    @default(0)
    retry_on_conflict: RetryOnConflict,

    @httpQuery("routing")
    routing: Routing,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("if_seq_no")
    if_seq_no: IfSeqNo,

    @httpQuery("if_primary_term")
    if_primary_term: IfPrimaryTerm,

    @httpQuery("require_alias")
    @default(false)
    require_alias: RequireAlias,
}

// TODO: Fill in Body Parameters
structure Update_BodyParams {}

@input
structure Update_Input with [Update_QueryParams] {
    @required
    @httpLabel
    id: PathDocumentId,

    @required
    @httpLabel
    index: PathIndex,
    @httpPayload
    content: Update_BodyParams,
}

// TODO: Fill in Output Structure
structure Update_Output {}
