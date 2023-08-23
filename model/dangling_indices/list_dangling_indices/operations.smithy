// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/dangling-index/"
)

@xOperationGroup("dangling_indices.list_dangling_indices")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_dangling")
@documentation("Returns all dangling indices.")
operation DanglingIndicesListDanglingIndices {
    input: DanglingIndicesListDanglingIndices_Input,
    output: DanglingIndicesListDanglingIndices_Output
}
