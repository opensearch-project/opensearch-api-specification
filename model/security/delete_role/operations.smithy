// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#delete-role"
)

@vendorExtensions(
    "x-operation-group": "security.delete_role",
    "x-version-added": "1.0"
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_plugins/_security/api/roles/{role}")
@documentation("Delete the specified role.")
operation DeleteRole {
    input: DeleteRole_Input,
    output: DeleteRole_Output
}
