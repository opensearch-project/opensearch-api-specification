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
    "x-operation-group": "cat.shards",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/shards")
@documentation("Provides a detailed view of shard allocation on nodes.")
operation CatShards {
    input: CatShards_Input,
    output: CatShards_Output
}

@vendorExtensions(
    "x-operation-group": "cat.shards",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/shards/{index}")
@documentation("Provides a detailed view of shard allocation on nodes.")
operation CatShards_WithIndex {
    input: CatShards_WithIndex_Input,
    output: CatShards_Output
}
