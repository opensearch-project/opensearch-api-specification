// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@xOperationGroup("indices.resolve_index")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_resolve/index/{name}")
@documentation("Returns information about any matching indices, aliases, and data streams.")
operation IndicesResolveIndex {
    input: IndicesResolveIndex_Input,
    output: IndicesResolveIndex_Output
}
