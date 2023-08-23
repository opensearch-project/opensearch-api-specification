// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@xOperationGroup("delete_by_query_rethrottle")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_delete_by_query/{task_id}/_rethrottle")
@documentation("Changes the number of requests per second for a particular Delete By Query operation.")
operation DeleteByQueryRethrottle {
    input: DeleteByQueryRethrottle_Input,
    output: DeleteByQueryRethrottle_Output
}
