// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/dangling-index/"
)

@vendorExtensions(
    "x-operation-group": "dangling_indices.import_dangling_index",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_dangling/{index_uuid}")
@documentation("Imports the specified dangling index.")
operation DanglingIndicesImportDanglingIndex {
    input: DanglingIndicesImportDanglingIndex_Input,
    output: DanglingIndicesImportDanglingIndex_Output
}
