// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#patch-roles"
)

@xOperationGroup("security.patch_roles")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PATCH", uri: "/_plugins/_security/api/roles")
@documentation("Creates, updates, or deletes multiple roles in a single call.")
operation PatchRoles {
    input: PatchRoles_Input,
    output: PatchRoles_Output
}
