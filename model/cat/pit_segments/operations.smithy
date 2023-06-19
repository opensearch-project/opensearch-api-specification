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
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "GET", uri: "/_cat/pit_segments")
@documentation("List segments for one or several PITs.")
operation PitSegments {
    input: PitSegments_Input,
    output: PitSegments_Output
}
