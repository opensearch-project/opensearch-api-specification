// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#create-role"
)

@vendorExtensions(
    "x-operation-group": "create_role",
    "x-version-added": "1.0"
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_plugins/_security/api/roles/{role}")
@documentation("Creates or replaces the specified role.")
operation CreateRole {
    input: CreateRole_Input,
    output: CreateRole_Output
}

