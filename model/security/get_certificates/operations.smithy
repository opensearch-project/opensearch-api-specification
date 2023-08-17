// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#get-certificates"
)

@xOperationGroup("security.get_certificates")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_security/api/ssl/certs")
@documentation("Retrieves the cluster’s security certificates.")
operation GetCertificates {
    input: GetCertificates_Input,
    output: GetCertificates_Output
}
