// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/document-apis/delete-by-query/"
)

@xOperationGroup("delete_by_query")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_delete_by_query")
@documentation("Deletes documents matching the provided query.")
operation DeleteByQuery {
    input: DeleteByQuery_Input,
    output: DeleteByQuery_Output
}
