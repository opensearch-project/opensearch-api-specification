// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/exists/"
)

@vendorExtensions(
    "x-operation-group": "indices.exists",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@readonly
@http(method: "HEAD", uri: "/{index}")
@documentation("Returns information about whether a particular index exists.")
operation IndicesExists {
    input: IndicesExists_Input,
    output: IndicesExists_Output
}
