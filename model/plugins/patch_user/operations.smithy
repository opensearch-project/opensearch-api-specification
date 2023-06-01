// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#patch-user"
)

@vendorExtensions(
    "x-operation-group": "security.patch_user",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PATCH", uri: "/_plugins/_security/api/internalusers/{username}")
@documentation("Updates individual attributes of an internal user.")
operation PatchUser {
    input: PatchUser_Input,
    output: PatchUser_Output
}

@vendorExtensions(
    "x-operation-group": "security.patch_users",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PATCH", uri: "/_plugins/_security/api/internalusers")
@documentation("Creates, updates, or deletes multiple internal users in a single call.")
operation PatchUsers {
    input: PatchUsers_Input,
    output: PatchUsers_Output
}
