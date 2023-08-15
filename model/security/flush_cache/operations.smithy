// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#flush-cache"
)

@vendorExtensions(
    "x-operation-group": "security.flush_cache",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@idempotent
@http(method: "DELETE", uri: "/_plugins/_security/api/cache")
@documentation("Flushes the Security plugin user, authentication, and authorization cache.")
operation FlushCache {
    input: FlushCache_Input,
    output: FlushCache_Output
}
