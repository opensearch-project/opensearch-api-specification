// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatTasks_QueryParams {
    @httpQuery("format")
    format: Format,

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

    @httpQuery("h")
    h: H,

    @httpQuery("help")
    @default(false)
    help: Help,

    @httpQuery("s")
    s: S,

    @httpQuery("time")
    time: Time,

    @httpQuery("v")
    @default(false)
    v: V,
}


@input
structure CatTasks_Input with [CatTasks_QueryParams] {
}

// TODO: Fill in Output Structure
structure CatTasks_Output {}
