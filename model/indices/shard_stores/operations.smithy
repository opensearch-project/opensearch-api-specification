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
    "x-operation-group": "indices.shard_stores",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_shard_stores")
@documentation("Provides store information for shard copies of indices.")
operation IndicesShardStores {
    input: IndicesShardStores_Input,
    output: IndicesShardStores_Output
}

@vendorExtensions(
    "x-operation-group": "indices.shard_stores",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_shard_stores")
@documentation("Provides store information for shard copies of indices.")
operation IndicesShardStores_WithIndex {
    input: IndicesShardStores_WithIndex_Input,
    output: IndicesShardStores_Output
}
