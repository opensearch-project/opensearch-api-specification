// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#patch-user"
)

@xOperationGroup("security.patch_user")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PATCH", uri: "/_plugins/_security/api/internalusers/{username}")
@documentation("Updates individual attributes of an internal user.")
operation PatchUser {
    input: PatchUser_Input,
    output: PatchUser_Output
}
