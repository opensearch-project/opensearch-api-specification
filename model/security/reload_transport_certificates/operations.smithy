//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#reload-transport-certificates"
)

@xOperationGroup("security.reload_transport_certificates")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_plugins/_security/api/ssl/transport/reloadcerts")
@documentation("Reload transport layer communication certificates.")
operation ReloadTransportCertificates {
    input: ReloadTransportCertificates_Input,
    output: ReloadTransportCertificates_Output
}
