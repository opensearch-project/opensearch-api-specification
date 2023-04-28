// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@vendorExtensions(
    "x-operation-group": "indices.upgrade",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_upgrade")
@documentation("The _upgrade API is no longer useful and will be removed.")
operation IndicesUpgrade {
    input: IndicesUpgrade_Input,
    output: IndicesUpgrade_Output
}

@vendorExtensions(
    "x-operation-group": "indices.upgrade",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_upgrade")
@documentation("The _upgrade API is no longer useful and will be removed.")
operation IndicesUpgrade_WithIndex {
    input: IndicesUpgrade_WithIndex_Input,
    output: IndicesUpgrade_Output
}
