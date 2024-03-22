// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/point-in-time-api/"
)
@xOperationGroup("cat.pit_segments")
@xVersionAdded("2.4")
@readonly
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "GET", uri: "/_cat/pit_segments")
@documentation("List segments for one or several PITs.")
operation CatPitSegments {
    input: CatPitSegments_Input,
    output: CatPitSegments_Output
}

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/point-in-time-api/"
)
@xOperationGroup("cat.all_pit_segments")
@xVersionAdded("2.4")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/pit_segments/_all")
@documentation("Lists all active point-in-time segments.")
operation CatAllPitSegments {
    input: CatAllPitSegments_Input,
    output: CatAllPitSegments_Output
}
