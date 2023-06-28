// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/document-apis/delete-document/"
)

@vendorExtensions(
    "x-operation-group": "delete",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/{index}/_doc/{id}")
@documentation("Removes a document from the index.")
operation Delete {
    input: Delete_Input,
    output: Delete_Output
}
