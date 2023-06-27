// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/script-apis/delete-script/"
)

@vendorExtensions(
    "x-operation-group": "delete_script",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_scripts/{id}")
@documentation("Deletes a script.")
operation DeleteScript {
    input: DeleteScript_Input,
    output: DeleteScript_Output
}
