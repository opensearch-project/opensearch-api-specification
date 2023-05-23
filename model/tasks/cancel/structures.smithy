// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure TasksCancel_QueryParams {
    @httpQuery("nodes")
    nodes: Nodes,

    @httpQuery("actions")
    @documentation("Comma-separated list of actions that should be cancelled. Leave empty to cancel all.")
    actions: Actions,

    @httpQuery("parent_task_id")
    @documentation("Cancel tasks with specified parent task id (node_id:task_number). Set to -1 to cancel all.")
    parent_task_id: ParentTaskId,

    @httpQuery("wait_for_completion")
    @default(false)
    wait_for_completion: WaitForCompletionFalse,
}


@input
structure TasksCancel_Input with [TasksCancel_QueryParams] {
}

@input
structure TasksCancel_WithTaskId_Input with [TasksCancel_QueryParams] {
    @required
    @httpLabel
    @documentation("Cancel the task with specified task id (node_id:task_number).")
    task_id: PathTaskId,
}

// TODO: Fill in Output Structure
structure TasksCancel_Output {}
