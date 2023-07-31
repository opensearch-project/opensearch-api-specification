
// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#update-configuration"
)

@vendorExtensions(
    "x-operation-group": "security.update_configuration",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_plugins/_security/api/securityconfig/config")
@documentation("Adds or updates the existing configuration using the REST API.")
operation UpdateConfiguration {
    input: UpdateConfiguration_Input,
    output: UpdateConfiguration_Output
}
