// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-indices/"
)

@vendorExtensions(
    "x-operation-group": "cat.indices",
    "x-version-added": "1.0"
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/indices")
@documentation("Returns information about indices: number of primaries and replicas, document counts, disk size, ...")
operation CatIndices {
    input: CatIndices_Input,
    output: CatIndices_Output
}

@vendorExtensions(
    "x-operation-group": "cat.indices",
    "x-version-added": "1.0"
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/indices/{index}")
@documentation("Returns information about indices: number of primaries and replicas, document counts, disk size, ...")
operation CatIndices_WithIndex {
    input: CatIndices_WithIndex_Input,
    output: CatIndices_Output
}

apply CatIndices_WithIndex @examples([
    {
        title: "Examples for Cat indices with Index Operation.",
        input: {
            index: "books",
        }
    }
])
