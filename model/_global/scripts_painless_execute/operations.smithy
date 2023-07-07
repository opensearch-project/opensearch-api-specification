// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/script-apis/exec-script/"
)

@vendorExtensions(
    "x-operation-group": "scripts_painless_execute",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_scripts/painless/_execute")
@documentation("Allows an arbitrary script to be executed and a result to be returned.")
operation ScriptsPainlessExecute_Get {
    input: ScriptsPainlessExecute_Get_Input,
    output: ScriptsPainlessExecute_Output
}

@vendorExtensions(
    "x-operation-group": "scripts_painless_execute",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_scripts/painless/_execute")
@documentation("Allows an arbitrary script to be executed and a result to be returned.")
operation ScriptsPainlessExecute_Post {
    input: ScriptsPainlessExecute_Post_Input,
    output: ScriptsPainlessExecute_Output
}
