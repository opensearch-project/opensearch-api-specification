// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@vendorExtensions(
    "x-operation-group": "tasks.cancel",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_tasks/_cancel")
@documentation("Cancels a task, if it can be cancelled through an API.")
operation TasksCancel {
    input: TasksCancel_Input,
    output: TasksCancel_Output
}

@vendorExtensions(
    "x-operation-group": "tasks.cancel",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_tasks/{task_id}/_cancel")
@documentation("Cancels a task, if it can be cancelled through an API.")
operation TasksCancel_WithTaskId {
    input: TasksCancel_WithTaskId_Input,
    output: TasksCancel_Output
}
