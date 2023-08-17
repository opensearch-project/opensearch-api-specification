// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#patch-users"
)

@xOperationGroup("security.patch_users")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PATCH", uri: "/_plugins/_security/api/internalusers")
@documentation("Creates, updates, or deletes multiple internal users in a single call.")
operation PatchUsers {
    input: PatchUsers_Input,
    output: PatchUsers_Output
}
