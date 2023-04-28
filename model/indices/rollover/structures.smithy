// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesRollover_QueryParams {
    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("dry_run")
    @default(false)
    dry_run: IndicesRolloverDryRun,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("wait_for_active_shards")
    @documentation("Set the number of active shards to wait for on the newly created rollover index before the operation returns.")
    wait_for_active_shards: WaitForActiveShards,
}

// TODO: Fill in Body Parameters
structure IndicesRollover_BodyParams {}

@input
structure IndicesRollover_Input with [IndicesRollover_QueryParams] {
    @required
    @httpLabel
    alias: PathAlias,
    @httpPayload
    content: IndicesRollover_BodyParams,
}

@input
structure IndicesRollover_WithNewIndex_Input with [IndicesRollover_QueryParams] {
    @required
    @httpLabel
    alias: PathAlias,

    @required
    @httpLabel
    new_index: PathNewIndex,
    @httpPayload
    content: IndicesRollover_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesRollover_Output {}
