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
    "x-operation-group": "indices.get_upgrade",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_upgrade")
@documentation("The _upgrade API is no longer useful and will be removed.")
operation IndicesGetUpgrade {
    input: IndicesGetUpgrade_Input,
    output: IndicesGetUpgrade_Output
}

@vendorExtensions(
    "x-operation-group": "indices.get_upgrade",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_upgrade")
@documentation("The _upgrade API is no longer useful and will be removed.")
operation IndicesGetUpgrade_WithIndex {
    input: IndicesGetUpgrade_WithIndex_Input,
    output: IndicesGetUpgrade_Output
}
