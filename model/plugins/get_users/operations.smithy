// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/"
)

@vendorExtensions(
    "x-operation-group": "get_users",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_security/api/internalusers")
@documentation("Lists of all internal users.")
operation GetAllUsers {
    input: GetAllUsers_Input,
    output: GetAllUsers_Output
}

@vendorExtensions(
    "x-operation-group": "get_user",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "GET", uri: "/_plugins/_security/api/internalusers/{username}")
@documentation("Providing information about given internal user.")
operation GetUser {
    input: GetUser_Input,
    output: GetUser_Output
}
