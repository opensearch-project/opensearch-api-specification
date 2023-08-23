// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/create-index/"
)

@xOperationGroup("indices.create")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}")
@documentation("Creates an index with optional settings and mappings.")
operation IndicesCreate {
    input: IndicesCreate_Input,
    output: IndicesCreate_Output
}


apply IndicesCreate @examples([
    {
        title: "Examples for Create Index Operation.",
        input: {
            index: "books"
        },
        output: {
            index: "books",
            shards_acknowledged: true,
            acknowledged: true
        }
    }
])
