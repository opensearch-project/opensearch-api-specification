// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/script-apis/delete-script/"
)

@xOperationGroup("delete_script")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_scripts/{id}")
@documentation("Deletes a script.")
operation DeleteScript {
    input: DeleteScript_Input,
    output: DeleteScript_Output
}
