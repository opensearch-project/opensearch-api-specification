// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/point-in-time-api/"
)

@vendorExtensions(
    "x-operation-group": "cat.pit_segments",
    "x-version-added": "2.4",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/pit_segments/_all")
@documentation("Lists all active point-in-time segments.")
operation GetAllPitSegments {
    input: GetAllPitSegments_Input,
    output: GetAllPitSegments_Output
}

@vendorExtensions(
    "x-operation-group": "cat.pit_segments",
    "x-version-added": "2.4",
)
@readonly
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "GET", uri: "/_cat/pit_segments")
@documentation("List segments for one or several PITs.")
operation GetPitSegments {
    input: GetPitSegments_Input,
    output: GetPitSegments_Output
}
