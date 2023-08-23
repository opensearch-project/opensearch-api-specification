// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-tasks/"
)

@xOperationGroup("cat.tasks")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/tasks")
@documentation("Returns information about the tasks currently executing on one or more nodes in the cluster.")
operation CatTasks {
    input: CatTasks_Input,
    output: CatTasks_Output
}
