// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/search-template/"
)

@vendorExtensions(
    "x-operation-group": "search_template",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_search/template")
@documentation("Allows to use the Mustache language to pre-render a search definition.")
operation SearchTemplate_Get {
    input: SearchTemplate_Get_Input,
    output: SearchTemplate_Output
}

@vendorExtensions(
    "x-operation-group": "search_template",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_search/template")
@documentation("Allows to use the Mustache language to pre-render a search definition.")
operation SearchTemplate_Post {
    input: SearchTemplate_Post_Input,
    output: SearchTemplate_Output
}

@vendorExtensions(
    "x-operation-group": "search_template",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_search/template")
@documentation("Allows to use the Mustache language to pre-render a search definition.")
operation SearchTemplate_Get_WithIndex {
    input: SearchTemplate_Get_WithIndex_Input,
    output: SearchTemplate_Output
}

@vendorExtensions(
    "x-operation-group": "search_template",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_search/template")
@documentation("Allows to use the Mustache language to pre-render a search definition.")
operation SearchTemplate_Post_WithIndex {
    input: SearchTemplate_Post_WithIndex_Input,
    output: SearchTemplate_Output
}
