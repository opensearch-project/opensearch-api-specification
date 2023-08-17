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

@xOperationGroup("dangling_indices.delete_dangling_index")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_dangling/{index_uuid}")
@documentation("Deletes the specified dangling index.")
operation DanglingIndicesDeleteDanglingIndex {
    input: DanglingIndicesDeleteDanglingIndex_Input,
    output: DanglingIndicesDeleteDanglingIndex_Output
}
