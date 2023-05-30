// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#delete-distinguished-names"
)

@vendorExtensions(
    "x-operation-group": "delete_distinguished_name",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_plugins/_security/api/nodesdn/{cluster_name}")
@documentation("Deletes all distinguished names in the specified cluster’s or node’s allow list.")
operation DeleteDistinguishedName {
    input: DeleteDistinguishedName_Input,
    output: DeleteDistinguishedName_Output
}
