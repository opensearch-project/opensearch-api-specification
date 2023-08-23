// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/document-apis/get-documents/"
)

@xOperationGroup("get_source")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_source/{id}")
@documentation("Returns the source of a document.")
operation GetSource {
    input: GetSource_Input,
    output: GetSource_Output
}

apply GetSource @examples([
    {
        title: "Examples for Get document source Operation.",
        input: {
            index: "books",
            id: "1"
        }
    }
])
