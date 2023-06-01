// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#get-certificates"
)

@vendorExtensions(
    "x-operation-group": "security.get_certificates",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_security/api/ssl/certs")
@documentation("Returns the cluster’s security certificates.")
operation GetCertificates {
    input: GetCertificates_Input,
    output: GetCertificates_Output
}
