// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/script-apis/get-stored-script/"
)

@xOperationGroup("get_script")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_scripts/{id}")
@documentation("Returns a script.")
operation GetScript {
    input: GetScript_Input,
    output: GetScript_Output
}
