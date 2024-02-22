// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/knn/api/#warmup-operation"
)

@xOperationGroup("knn.warmup")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_knn/warmup/{index}")
@documentation("Preloads native library files into memory, reducing initial search latency for specified indexes")
operation KNNWarmup {
    input: KNNWarmup_Input,
    output: KNNWarmup_Output
}
