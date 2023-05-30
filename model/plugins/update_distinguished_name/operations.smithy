
// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#update-distinguished-names"
)

@vendorExtensions(
    "x-operation-group": "update_distinguished_name",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_plugins/_security/api/nodesdn/{cluster_name}")
@documentation("Adds or updates the specified distinguished names in the cluster’s or node’s allow list.")
operation CreateDistinguishedName {
    input: CreateDistinguishedName_Input,
    output: CreateDistinguishedName_Output
}
