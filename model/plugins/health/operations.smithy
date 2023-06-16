// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#health"
)

@vendorExtensions(
    "x-operation-group": "security.health_check",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_security/health")
@documentation("Checks to see if the Security plugin is up and running.")
operation HealthCheck {
    input: HealthCheck_Input,
    output: HealthCheck_Output
}
