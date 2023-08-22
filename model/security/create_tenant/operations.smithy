// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#create-tenant"
)

@xOperationGroup("security.create_tenant")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_plugins/_security/api/tenants/{tenant}")
@documentation("Creates or replaces the specified tenant.")
operation CreateTenant {
    input: CreateTenant_Input,
    output: CreateTenant_Output
}
