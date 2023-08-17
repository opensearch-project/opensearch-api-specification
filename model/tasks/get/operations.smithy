// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/tasks/"
)

@xOperationGroup("tasks.get")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_tasks/{task_id}")
@documentation("Returns information about a task.")
operation TasksGet {
    input: TasksGet_Input,
    output: TasksGet_Output
}
