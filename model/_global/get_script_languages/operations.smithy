// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/script-apis/get-script-language/"
)

@xOperationGroup("get_script_languages")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_script_language")
@documentation("Returns available script types, languages and contexts.")
operation GetScriptLanguages {
    input: GetScriptLanguages_Input,
    output: GetScriptLanguages_Output
}
