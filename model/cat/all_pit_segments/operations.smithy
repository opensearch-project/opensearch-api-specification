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
    "x-operation-group": "cat.all_pit_segments",
    "x-version-added": "2.4",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/pit_segments/_all")
@documentation("Lists all active point-in-time segments.")
operation CatAllPitSegments {
    input: CatAllPitSegments_Input,
    output: CatAllPitSegments_Output
}
