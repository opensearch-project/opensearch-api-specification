// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/document-apis/get-documents/"
)

@vendorExtensions(
    "x-operation-group": "get",
    "x-version-added": "1.0"
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_doc/{id}")
@documentation("Returns a document.")
operation Get {
    input: Get_Input,
    output: Get_Output
}

apply Get @examples([
    {
        title: "Examples for Get document doc Operation.",
        input: {
            index: "books",
            id: "1"
        },
        output: {
            _index: "books",
            _id: "1",
            found: true
        }
    }
])
