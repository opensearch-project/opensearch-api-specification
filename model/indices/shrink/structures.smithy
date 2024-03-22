// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesShrink_QueryParams {
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

    @httpQuery("wait_for_completion")
    @default(true)
    wait_for_completion: WaitForCompletionTrue,

    @httpQuery("task_execution_timeout")
    task_execution_timeout: TaskExecutionTimeout,
}

// TODO: Fill in Body Parameters
@documentation("The configuration for the target index (`settings` and `aliases`)")
structure IndicesShrink_BodyParams {}

@input
structure IndicesShrink_Put_Input with [IndicesShrink_QueryParams] {
    @required
    @httpLabel
    @documentation("The name of the source index to shrink.")
    index: PathIndex,

    @required
    @httpLabel
    target: PathTarget,
    @httpPayload
    content: IndicesShrink_BodyParams,
}

@input
structure IndicesShrink_Post_Input with [IndicesShrink_QueryParams] {
    @required
    @httpLabel
    @documentation("The name of the source index to shrink.")
    index: PathIndex,

    @required
    @httpLabel
    target: PathTarget,
    @httpPayload
    content: IndicesShrink_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesShrink_Output {}
