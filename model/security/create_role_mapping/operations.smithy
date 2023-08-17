// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#create-role-mapping"
)

@xOperationGroup("security.create_role_mapping")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_plugins/_security/api/rolesmapping/{role}")
@documentation("Creates or replaces the specified role mapping.")
operation CreateRoleMapping {
    input: CreateRoleMapping_Input,
    output: CreateRoleMapping_Output
}
