// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/get-settings/"
)

@vendorExtensions(
    "x-operation-group": "indices.get_settings",
    "x-version-added": "1.0"
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_settings")
@documentation("Returns settings for one or more indices.")
operation IndicesGetSettings {
    input: IndicesGetSettings_Input,
    output: IndicesGetSettings_Output
}

@vendorExtensions(
    "x-operation-group": "indices.get_settings",
    "x-version-added": "1.0"
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_settings")
@documentation("Returns settings for one or more indices.")
operation IndicesGetSettings_WithIndex {
    input: IndicesGetSettings_WithIndex_Input,
    output: IndicesGetSettings_Output
}

@vendorExtensions(
    "x-operation-group": "indices.get_settings",
    "x-version-added": "1.0"
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_settings/{name}")
@documentation("Returns settings for one or more indices.")
operation IndicesGetSettings_WithIndexName {
    input: IndicesGetSettings_WithIndexName_Input,
    output: IndicesGetSettings_Output
}

@vendorExtensions(
    "x-operation-group": "indices.get_settings",
    "x-version-added": "1.0"
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_settings/{name}")
@documentation("Returns settings for one or more indices.")
operation IndicesGetSettings_WithName {
    input: IndicesGetSettings_WithName_Input,
    output: IndicesGetSettings_Output
}

apply IndicesGetSettings_WithIndex @examples([
    {
        title: "Examples for Get settings Index Operation.",
        input: {
            index: "books"
        },
    }
])

apply IndicesGetSettings_WithIndexName @examples([
    {
        title: "Examples for Get settings Index-setting Operation.",
        input: {
            index: "books",
            name: "index"
        }
    }
])
