// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#patch-role-mappings"
)

@vendorExtensions(
    "x-operation-group": "security.patch_role_mappings",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PATCH", uri: "/_plugins/_security/api/rolesmapping")
@documentation("Creates or updates multiple role mappings in a single call.")
operation PatchRoleMappings {
    input: PatchRoleMappings_Input,
    output: PatchRoleMappings_Output
}
