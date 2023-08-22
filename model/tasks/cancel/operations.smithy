// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/tasks/#task-canceling"
)

@xOperationGroup("tasks.cancel")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_tasks/_cancel")
@documentation("Cancels a task, if it can be cancelled through an API.")
operation TasksCancel {
    input: TasksCancel_Input,
    output: TasksCancel_Output
}

@xOperationGroup("tasks.cancel")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_tasks/{task_id}/_cancel")
@documentation("Cancels a task, if it can be cancelled through an API.")
operation TasksCancel_WithTaskId {
    input: TasksCancel_WithTaskId_Input,
    output: TasksCancel_Output
}
