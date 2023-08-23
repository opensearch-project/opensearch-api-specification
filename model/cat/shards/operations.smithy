// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-shards/"
)

@xOperationGroup("cat.shards")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/shards")
@documentation("Provides a detailed view of shard allocation on nodes.")
operation CatShards {
    input: CatShards_Input,
    output: CatShards_Output
}

@xOperationGroup("cat.shards")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/shards/{index}")
@documentation("Provides a detailed view of shard allocation on nodes.")
operation CatShards_WithIndex {
    input: CatShards_WithIndex_Input,
    output: CatShards_Output
}
