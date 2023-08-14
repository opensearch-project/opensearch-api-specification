// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#get-configuration"
)

@vendorExtensions(
    "x-operation-group": "security.get_configuration",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "GET", uri: "/_plugins/_security/api/securityconfig")
@documentation("Returns the current Security plugin configuration in JSON format.")
operation GetConfiguration {
    input: GetConfiguration_Input,
    output: GetConfiguration_Output
}
