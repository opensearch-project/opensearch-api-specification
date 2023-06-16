// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#delete-role-mapping"
)

@vendorExtensions(
    "x-operation-group": "security.delete_role_mapping",
    "x-version-added": "1.0"
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_plugins/_security/api/rolesmapping/{role}")
@documentation("Deletes the specified role mapping.")
operation DeleteRoleMapping {
    input: DeleteRoleMapping_Input,
    output: DeleteRoleMapping_Output
}
