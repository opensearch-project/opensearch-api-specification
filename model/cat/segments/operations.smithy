// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-segments/"
)

@xOperationGroup("cat.segments")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/segments")
@documentation("Provides low-level information about the segments in the shards of an index.")
operation CatSegments {
    input: CatSegments_Input,
    output: CatSegments_Output
}

@xOperationGroup("cat.segments")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/segments/{index}")
@documentation("Provides low-level information about the segments in the shards of an index.")
operation CatSegments_WithIndex {
    input: CatSegments_WithIndex_Input,
    output: CatSegments_Output
}
