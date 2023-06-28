// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/document-apis/index-document/"
)

@vendorExtensions(
    "x-operation-group": "create",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}/_create/{id}")
@documentation("Creates a new document in the index.

Returns a 409 response when a document with a same ID already exists in the index.")
operation Create_Put {
    input: Create_Put_Input,
    output: Create_Output
}

@vendorExtensions(
    "x-operation-group": "create",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_create/{id}")
@documentation("Creates a new document in the index.

Returns a 409 response when a document with a same ID already exists in the index.")
operation Create_Post {
    input: Create_Post_Input,
    output: Create_Output
}
