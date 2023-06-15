// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesSplit_QueryParams {
    @httpQuery("copy_settings")
    @default(false)
    copy_settings: CopySettings,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("wait_for_active_shards")
    @documentation("Set the number of active shards to wait for on the shrunken index before the operation returns.")
    wait_for_active_shards: WaitForActiveShards,
}

// TODO: Fill in Body Parameters
@documentation("The configuration for the target index (`settings` and `aliases`)")
structure IndicesSplit_BodyParams {}

@input
structure IndicesSplit_Put_Input with [IndicesSplit_QueryParams] {
    @required
    @httpLabel
    @documentation("The name of the source index to split.")
    index: PathIndex,

    @required
    @httpLabel
    target: PathTarget,
    @httpPayload
    content: IndicesSplit_BodyParams,
}

@input
structure IndicesSplit_Post_Input with [IndicesSplit_QueryParams] {
    @required
    @httpLabel
    @documentation("The name of the source index to split.")
    index: PathIndex,

    @required
    @httpLabel
    target: PathTarget,
    @httpPayload
    content: IndicesSplit_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesSplit_Output {}
