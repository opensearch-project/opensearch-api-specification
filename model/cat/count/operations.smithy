// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-count/"
)

@xOperationGroup("cat.count")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/count")
@documentation("Provides quick access to the document count of the entire cluster, or individual indices.")
operation CatCount {
    input: CatCount_Input,
    output: CatCount_Output
}

@xOperationGroup("cat.count")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/count/{index}")
@documentation("Provides quick access to the document count of the entire cluster, or individual indices.")
operation CatCount_WithIndex {
    input: CatCount_WithIndex_Input,
    output: CatCount_Output
}
