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

@xOperationGroup("indices.segments")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_segments")
@documentation("Provides low-level information about segments in a Lucene index.")
operation IndicesSegments {
    input: IndicesSegments_Input,
    output: IndicesSegments_Output
}

@xOperationGroup("indices.segments")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_segments")
@documentation("Provides low-level information about segments in a Lucene index.")
operation IndicesSegments_WithIndex {
    input: IndicesSegments_WithIndex_Input,
    output: IndicesSegments_Output
}
