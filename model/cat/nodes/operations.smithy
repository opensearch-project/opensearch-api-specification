// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-nodes/"
)

@xOperationGroup("cat.nodes")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/nodes")
@documentation("Returns basic statistics about performance of cluster nodes.")
operation CatNodes {
    input: CatNodes_Input,
    output: CatNodes_Output
}
