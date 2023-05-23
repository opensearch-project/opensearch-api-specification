// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure TasksGet_QueryParams {
    @httpQuery("wait_for_completion")
    @default(false)
    wait_for_completion: WaitForCompletionFalse,

    @httpQuery("timeout")
    timeout: Timeout,
}


@input
structure TasksGet_Input with [TasksGet_QueryParams] {
    @required
    @httpLabel
    @documentation("Return the task with specified id (node_id:task_number).")
    task_id: PathTaskId,
}

// TODO: Fill in Output Structure
structure TasksGet_Output {}
