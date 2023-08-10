
// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#update-all-distinguished-names"
)

@vendorExtensions(
    "x-operation-group": "security.update_all_distinguished_names",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PATCH", uri: "/_plugins/_security/api/nodesdn")
@documentation("Bulk update of distinguished names.")
operation UpdateAllDistinguishedNames {
    input: UpdateAllDistinguishedNames_Input,
    output: UpdateAllDistinguishedNames_Output
}
