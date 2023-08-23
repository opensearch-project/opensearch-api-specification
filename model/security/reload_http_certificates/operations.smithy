//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#reload-http-certificates"
)

@xOperationGroup("security.reload_http_certificates")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "PUT", uri: "/_plugins/_security/api/ssl/http/reloadcerts")
@documentation("Reload HTTP layer communication certificates.")
operation ReloadHttpCertificates {
    input: ReloadHttpCertificates_Input,
    output: ReloadHttpCertificates_Output
}
