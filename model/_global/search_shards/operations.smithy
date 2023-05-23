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
    "x-operation-group": "search_shards",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_search_shards")
@documentation("Returns information about the indices and shards that a search request would be executed against.")
operation SearchShards_Get {
    input: SearchShards_Get_Input,
    output: SearchShards_Output
}

@vendorExtensions(
    "x-operation-group": "search_shards",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_search_shards")
@documentation("Returns information about the indices and shards that a search request would be executed against.")
operation SearchShards_Post {
    input: SearchShards_Post_Input,
    output: SearchShards_Output
}

@vendorExtensions(
    "x-operation-group": "search_shards",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_search_shards")
@documentation("Returns information about the indices and shards that a search request would be executed against.")
operation SearchShards_Get_WithIndex {
    input: SearchShards_Get_WithIndex_Input,
    output: SearchShards_Output
}

@vendorExtensions(
    "x-operation-group": "search_shards",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_search_shards")
@documentation("Returns information about the indices and shards that a search request would be executed against.")
operation SearchShards_Post_WithIndex {
    input: SearchShards_Post_WithIndex_Input,
    output: SearchShards_Output
}
