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
    "x-operation-group": "clear_scroll",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "DELETE", uri: "/_search/scroll")
@documentation("Explicitly clears the search context for a scroll.")
operation ClearScroll {
    input: ClearScroll_Input,
    output: ClearScroll_Output
}

@deprecated
@vendorExtensions(
    "x-operation-group": "clear_scroll",
    "x-version-added": "1.0",
    "x-deprecation-message": "A scroll id can be quite large and should be specified as part of the body",
    "x-version-deprecated": "7.0.0",
)
@idempotent
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "DELETE", uri: "/_search/scroll/{scroll_id}")
@documentation("Explicitly clears the search context for a scroll.")
operation ClearScroll_WithScrollId {
    input: ClearScroll_WithScrollId_Input,
    output: ClearScroll_Output
}
