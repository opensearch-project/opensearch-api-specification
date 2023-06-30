//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#reload-certificates"
)

@vendorExtensions(
    "x-operation-group": "security.reload_http_certificates",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "PUT", uri: "/_opendistro/_security/api/ssl/http/reloadcerts")
@documentation("Reloads SSL certificates that are about to expire without restarting the OpenSearch node.")
operation ReloadHttpCertificates {
    input: ReloadHttpCertificates_Input,
    output: ReloadHttpCertificates_Output
}
