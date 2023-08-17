// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#create-user"
)

@xOperationGroup("security.create_user")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_plugins/_security/api/internalusers/{username}")
@documentation("Creates or replaces the specified user.")
operation CreateUser {
    input: CreateUser_Input,
    output: CreateUser_Output
}
