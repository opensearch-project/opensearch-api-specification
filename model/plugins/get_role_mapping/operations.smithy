// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#get-role-mapping"
)

@vendorExtensions(
    "x-operation-group": "get_role_mapping",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "GET", uri: "/_plugins/_security/api/rolesmapping/{role}")
@documentation("Retrieves one role mapping.")
operation GetRoleMapping {
    input: GetRoleMapping_Input,
    output: GetRoleMapping_Output
}

@vendorExtensions(
    "x-operation-group": "get_roles_mapping",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_security/api/rolesmapping")
@documentation("Retrieves all role mappings.")
operation GetAllRolesMapping {
    input: GetAllRolesMapping_Input,
    output: GetAllRolesMapping_Output
}