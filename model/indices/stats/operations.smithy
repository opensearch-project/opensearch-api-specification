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
    "x-operation-group": "indices.stats",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_stats")
@documentation("Provides statistics on operations happening in an index.")
operation IndicesStats {
    input: IndicesStats_Input,
    output: IndicesStats_Output
}

@vendorExtensions(
    "x-operation-group": "indices.stats",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_stats")
@documentation("Provides statistics on operations happening in an index.")
operation IndicesStats_WithIndex {
    input: IndicesStats_WithIndex_Input,
    output: IndicesStats_Output
}

@vendorExtensions(
    "x-operation-group": "indices.stats",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_stats/{metric}")
@documentation("Provides statistics on operations happening in an index.")
operation IndicesStats_WithMetric {
    input: IndicesStats_WithMetric_Input,
    output: IndicesStats_Output
}

@vendorExtensions(
    "x-operation-group": "indices.stats",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_stats/{metric}")
@documentation("Provides statistics on operations happening in an index.")
operation IndicesStats_WithIndexMetric {
    input: IndicesStats_WithIndexMetric_Input,
    output: IndicesStats_Output
}
