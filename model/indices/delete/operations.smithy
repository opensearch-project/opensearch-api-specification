// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/delete-index/"
)
@xOperationGroup("indices.delete")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/{index}")
@documentation("Deletes an index.")
operation IndicesDelete {
    input: IndicesDelete_Input,
    output: IndicesDelete_Output
}

apply IndicesDelete @examples([
    {
        title: "Examples for Delete Index Operation.",
        input: {
            index: "books"
        },
        output: {
            acknowledged: true
        }
    }
])
