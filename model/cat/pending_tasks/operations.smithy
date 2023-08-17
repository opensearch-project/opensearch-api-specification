// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-pending-tasks/"
)

@xOperationGroup("cat.pending_tasks")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/pending_tasks")
@documentation("Returns a concise representation of the cluster pending tasks.")
operation CatPendingTasks {
    input: CatPendingTasks_Input,
    output: CatPendingTasks_Output
}
