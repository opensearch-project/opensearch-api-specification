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
    "x-operation-group": "scroll",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_search/scroll")
@documentation("Allows to retrieve a large numbers of results from a single search request.")
operation Scroll_Get {
    input: Scroll_Get_Input,
    output: Scroll_Output
}

@vendorExtensions(
    "x-operation-group": "scroll",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_search/scroll")
@documentation("Allows to retrieve a large numbers of results from a single search request.")
operation Scroll_Post {
    input: Scroll_Post_Input,
    output: Scroll_Output
}

@deprecated
@vendorExtensions(
    "x-operation-group": "scroll",
    "x-version-added": "1.0",
    "x-deprecation-message": "A scroll id can be quite large and should be specified as part of the body",
    "x-version-deprecated": "7.0.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_search/scroll/{scroll_id}")
@documentation("Allows to retrieve a large numbers of results from a single search request.")
operation Scroll_Get_WithScrollId {
    input: Scroll_Get_WithScrollId_Input,
    output: Scroll_Output
}

@deprecated
@vendorExtensions(
    "x-operation-group": "scroll",
    "x-version-added": "1.0",
    "x-deprecation-message": "A scroll id can be quite large and should be specified as part of the body",
    "x-version-deprecated": "7.0.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_search/scroll/{scroll_id}")
@documentation("Allows to retrieve a large numbers of results from a single search request.")
operation Scroll_Post_WithScrollId {
    input: Scroll_Post_WithScrollId_Input,
    output: Scroll_Output
}
