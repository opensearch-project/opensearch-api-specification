// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#delete-distinguished-names"
)

@vendorExtensions(
    "x-operation-group": "security.delete_distinguished_names",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_plugins/_security/api/nodesdn/{cluster_name}")
@documentation("Deletes all distinguished names in the specified cluster’s or node’s allow list.")
operation DeleteDistinguishedNames {
    input: DeleteDistinguishedNames_Input,
    output: DeleteDistinguishedNames_Output
}
