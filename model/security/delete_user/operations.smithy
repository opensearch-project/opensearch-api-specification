// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#delete-user"
)

@xOperationGroup("security.delete_user")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_plugins/_security/api/internalusers/{username}")
@documentation("Delete the specified user.")
operation DeleteUser {
    input: DeleteUser_Input,
    output: DeleteUser_Output
}
