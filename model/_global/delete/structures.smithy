// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Delete_QueryParams {
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

    @httpQuery("if_seq_no")
    if_seq_no: IfSeqNo,

    @httpQuery("if_primary_term")
    if_primary_term: IfPrimaryTerm,

    @httpQuery("version")
    version: Version,

    @httpQuery("version_type")
    version_type: VersionType,
}


@input
structure Delete_Input with [Delete_QueryParams] {
    @required
    @httpLabel
    id: PathDocumentId,

    @required
    @httpLabel
    index: PathIndex,
}

// TODO: Fill in Output Structure
structure Delete_Output {}
