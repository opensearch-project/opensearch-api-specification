// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#get-role"
)

@vendorExtensions(
    "x-operation-group": "security.get_role",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "GET", uri: "/_plugins/_security/api/roles/{role}")
@documentation("Retrieves one role.")
operation GetRole {
    input: GetRole_Input,
    output: GetRole_Output
}

@vendorExtensions(
    "x-operation-group": "security.get_roles",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_security/api/roles/")
@documentation("Retrieves all roles.")
operation GetAllRoles {
    input: GetAllRoles_Input,
    output: GetAllRoles_Output
}
