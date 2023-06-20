// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Reindex_QueryParams {
    @httpQuery("refresh")
    @documentation("Should the affected indexes be refreshed?.")
    refresh: RefreshBoolean,

    @httpQuery("timeout")
    @default("1m")
    timeout: BulkTimeout,

    @httpQuery("wait_for_active_shards")
    @documentation("Sets the number of shard copies that must be active before proceeding with the operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1).")
    @default("1")
    wait_for_active_shards: WaitForActiveShards,

    @httpQuery("wait_for_completion")
    @default(true)
    wait_for_completion: WaitForCompletionTrue,

    @httpQuery("requests_per_second")
    @default(0)
    requests_per_second: RequestsPerSecond,

    @httpQuery("scroll")
    scroll: Scroll,

    @httpQuery("slices")
    @default("1")
    slices: Slices,

    @httpQuery("max_docs")
    max_docs: MaxDocs,
}

// TODO: Fill in Body Parameters
@documentation("The search definition using the Query DSL and the prototype for the index request.")
structure Reindex_BodyParams {}

@input
structure Reindex_Input with [Reindex_QueryParams] {
    @required
    @httpPayload
    content: Reindex_BodyParams,
}

// TODO: Fill in Output Structure
structure Reindex_Output {}
