//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#delete-action-group"
)

@vendorExtensions(
    "x-operation-group": "security.delete_tenant",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "DELETE", uri: "/_plugins/_security/api/tenants/{tenant}")
@documentation("Delete the specified tenant.")
operation DeleteTenant {
    input: DeleteTenant_Input,
    output: DeleteTenant_Output
}
