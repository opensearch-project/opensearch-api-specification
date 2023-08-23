
// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#update-distinguished-names"
)

@xOperationGroup("security.update_distinguished_names")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_plugins/_security/api/nodesdn/{cluster_name}")
@documentation("Adds or updates the specified distinguished names in the cluster’s or node’s allow list.")
operation UpdateDistinguishedNames {
    input: UpdateDistinguishedNames_Input,
    output: UpdateDistinguishedNames_Output
}
