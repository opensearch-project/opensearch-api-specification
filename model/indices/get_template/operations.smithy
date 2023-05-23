// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@vendorExtensions(
    "x-operation-group": "indices.get_template",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_template")
@documentation("Returns an index template.")
operation IndicesGetTemplate {
    input: IndicesGetTemplate_Input,
    output: IndicesGetTemplate_Output
}

@vendorExtensions(
    "x-operation-group": "indices.get_template",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_template/{name}")
@documentation("Returns an index template.")
operation IndicesGetTemplate_WithName {
    input: IndicesGetTemplate_WithName_Input,
    output: IndicesGetTemplate_Output
}
