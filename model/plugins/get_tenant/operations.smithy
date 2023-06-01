//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#get-tenant"
)

@vendorExtensions(
    "x-operation-group": "security.get_tenants",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_security/api/tenants/")
@documentation("List of all tenants.")
operation GetTenants {
    input: GetTenants_Input,
    output: GetTenants_Output
}

@vendorExtensions(
    "x-operation-group": "security.get_tenant",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "GET", uri: "/_plugins/_security/api/tenants/{tenant}")
@documentation("Returns information about given tenant.")
operation GetTenant {
    input: GetTenant_Input,
    output: GetTenant_Output
}
