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
    "x-operation-group": "indices.shrink",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}/_shrink/{target}")
@documentation("Allow to shrink an existing index into a new index with fewer primary shards.")
operation IndicesShrink_Put {
    input: IndicesShrink_Put_Input,
    output: IndicesShrink_Output
}

@vendorExtensions(
    "x-operation-group": "indices.shrink",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_shrink/{target}")
@documentation("Allow to shrink an existing index into a new index with fewer primary shards.")
operation IndicesShrink_Post {
    input: IndicesShrink_Post_Input,
    output: IndicesShrink_Output
}
