// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-allocation/"
)

@vendorExtensions(
    "x-operation-group": "cat.allocation",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/allocation")
@documentation("Provides a snapshot of how many shards are allocated to each data node and how much disk space they are using.")
operation CatAllocation {
    input: CatAllocation_Input,
    output: CatAllocation_Output
}

@vendorExtensions(
    "x-operation-group": "cat.allocation",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/allocation/{node_id}")
@documentation("Provides a snapshot of how many shards are allocated to each data node and how much disk space they are using.")
operation CatAllocation_WithNodeId {
    input: CatAllocation_WithNodeId_Input,
    output: CatAllocation_Output
}
