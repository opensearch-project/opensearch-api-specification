// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#patch-configuration"
)

@vendorExtensions(
    "x-operation-group": "security.patch_configuration",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PATCH", uri: "/_plugins/_security/api/securityconfig")
@documentation("A PATCH call is used to update the existing configuration using the REST API.")
operation PatchConfiguration {
    input: PatchConfiguration_Input,
    output: PatchConfiguration_Output
}
