// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure TasksList_QueryParams {
    @httpQuery("nodes")
    nodes: Nodes,

    @httpQuery("actions")
    @documentation("Comma-separated list of actions that should be returned. Leave empty to return all.")
    actions: Actions,

    @httpQuery("detailed")
    @documentation("Return detailed task information.")
    @default(false)
    detailed: Detailed,

    @httpQuery("parent_task_id")
    @documentation("Return tasks with specified parent task id (node_id:task_number). Set to -1 to return all.")
    parent_task_id: ParentTaskId,

    @httpQuery("wait_for_completion")
    @default(false)
    wait_for_completion: WaitForCompletionFalse,

    @httpQuery("group_by")
    @default("nodes")
    group_by: GroupBy,

    @httpQuery("timeout")
    timeout: Timeout,
}


@input
structure TasksList_Input with [TasksList_QueryParams] {
}

// TODO: Fill in Output Structure
structure TasksList_Output {}
