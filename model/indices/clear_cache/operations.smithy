// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/clear-index-cache/"
)

@xOperationGroup("indices.clear_cache")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_cache/clear")
@documentation("Clears all or specific caches for one or more indices.")
operation IndicesClearCache {
    input: IndicesClearCache_Input,
    output: IndicesClearCache_Output
}

@xOperationGroup("indices.clear_cache")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_cache/clear")
@documentation("Clears all or specific caches for one or more indices.")
operation IndicesClearCache_WithIndex {
    input: IndicesClearCache_WithIndex_Input,
    output: IndicesClearCache_Output
}
