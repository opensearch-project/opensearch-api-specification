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
    "x-operation-group": "msearch_template",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_msearch/template")
@documentation("Allows to execute several search template operations in one request.")
operation MsearchTemplate_Get {
    input: MsearchTemplate_Get_Input,
    output: MsearchTemplate_Output
}

@vendorExtensions(
    "x-operation-group": "msearch_template",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_msearch/template")
@documentation("Allows to execute several search template operations in one request.")
operation MsearchTemplate_Post {
    input: MsearchTemplate_Post_Input,
    output: MsearchTemplate_Output
}

@vendorExtensions(
    "x-operation-group": "msearch_template",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_msearch/template")
@documentation("Allows to execute several search template operations in one request.")
operation MsearchTemplate_Get_WithIndex {
    input: MsearchTemplate_Get_WithIndex_Input,
    output: MsearchTemplate_Output
}

@vendorExtensions(
    "x-operation-group": "msearch_template",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_msearch/template")
@documentation("Allows to execute several search template operations in one request.")
operation MsearchTemplate_Post_WithIndex {
    input: MsearchTemplate_Post_WithIndex_Input,
    output: MsearchTemplate_Output
}
