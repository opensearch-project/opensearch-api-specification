// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/script-apis/create-stored-script/"
)

@xOperationGroup("put_script")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_scripts/{id}")
@documentation("Creates or updates a script.")
operation PutScript_Put {
    input: PutScript_Put_Input,
    output: PutScript_Output
}

@xOperationGroup("put_script")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_scripts/{id}")
@documentation("Creates or updates a script.")
operation PutScript_Post {
    input: PutScript_Post_Input,
    output: PutScript_Output
}

@xOperationGroup("put_script")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_scripts/{id}/{context}")
@documentation("Creates or updates a script.")
operation PutScript_Put_WithContext {
    input: PutScript_Put_WithContext_Input,
    output: PutScript_Output
}

@xOperationGroup("put_script")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_scripts/{id}/{context}")
@documentation("Creates or updates a script.")
operation PutScript_Post_WithContext {
    input: PutScript_Post_WithContext_Input,
    output: PutScript_Output
}
