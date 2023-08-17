// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/document-apis/update-by-query/"
)

@xOperationGroup("update_by_query")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_update_by_query")
@documentation("Performs an update on every document in the index without changing the source,
for example to pick up a mapping change.")
operation UpdateByQuery {
    input: UpdateByQuery_Input,
    output: UpdateByQuery_Output
}
