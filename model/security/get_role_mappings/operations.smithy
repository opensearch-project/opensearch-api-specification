// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#get-role-mappings"
)

@xOperationGroup("security.get_role_mappings")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_security/api/rolesmapping")
@documentation("Retrieves all role mappings.")
operation GetRoleMappings {
    input: GetRoleMappings_Input,
    output: GetRoleMappings_Output
}
