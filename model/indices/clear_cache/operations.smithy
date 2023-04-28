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
    "x-operation-group": "indices.clear_cache",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_cache/clear")
@documentation("Clears all or specific caches for one or more indices.")
operation IndicesClearCache {
    input: IndicesClearCache_Input,
    output: IndicesClearCache_Output
}

@vendorExtensions(
    "x-operation-group": "indices.clear_cache",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_cache/clear")
@documentation("Clears all or specific caches for one or more indices.")
operation IndicesClearCache_WithIndex {
    input: IndicesClearCache_WithIndex_Input,
    output: IndicesClearCache_Output
}
