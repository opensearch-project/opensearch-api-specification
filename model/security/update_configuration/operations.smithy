
// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#update-configuration"
)

@xOperationGroup("security.update_configuration")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_plugins/_security/api/securityconfig/config")
@documentation("Adds or updates the existing configuration using the REST API.")
operation UpdateConfiguration {
    input: UpdateConfiguration_Input,
    output: UpdateConfiguration_Output
}
