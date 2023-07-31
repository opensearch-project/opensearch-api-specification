// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/update-settings/"
)

@vendorExtensions(
    "x-operation-group": "indices.put_settings",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_settings")
@documentation("Updates the index settings.")
operation IndicesPutSettings {
    input: IndicesPutSettings_Input,
    output: IndicesPutSettings_Output
}

@vendorExtensions(
    "x-operation-group": "indices.put_settings",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}/_settings")
@documentation("Updates the index settings.")
operation IndicesPutSettings_WithIndex {
    input: IndicesPutSettings_WithIndex_Input,
    output: IndicesPutSettings_Output
}
