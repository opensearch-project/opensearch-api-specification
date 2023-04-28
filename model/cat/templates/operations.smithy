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
    "x-operation-group": "cat.templates",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/templates")
@documentation("Returns information about existing templates.")
operation CatTemplates {
    input: CatTemplates_Input,
    output: CatTemplates_Output
}

@vendorExtensions(
    "x-operation-group": "cat.templates",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/templates/{name}")
@documentation("Returns information about existing templates.")
operation CatTemplates_WithName {
    input: CatTemplates_WithName_Input,
    output: CatTemplates_Output
}
