// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/shrink-index/"
)

@xOperationGroup("indices.shrink")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}/_shrink/{target}")
@documentation("Allow to shrink an existing index into a new index with fewer primary shards.")
operation IndicesShrink_Put {
    input: IndicesShrink_Put_Input,
    output: IndicesShrink_Output
}

@xOperationGroup("indices.shrink")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_shrink/{target}")
@documentation("Allow to shrink an existing index into a new index with fewer primary shards.")
operation IndicesShrink_Post {
    input: IndicesShrink_Post_Input,
    output: IndicesShrink_Output
}
