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
    "x-operation-group": "exists",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@readonly
@http(method: "HEAD", uri: "/{index}/_doc/{id}")
@documentation("Returns information about whether a document exists in an index.")
operation Exists {
    input: Exists_Input,
    output: Exists_Output
}
