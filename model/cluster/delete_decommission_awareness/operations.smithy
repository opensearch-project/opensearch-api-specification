// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cluster-api/cluster-decommission/#example-decommissioning-and-recommissioning-a-zone"
)

@vendorExtensions(
    "x-operation-group": "cluster.delete_decommission_awareness",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_cluster/decommission/awareness/")
@documentation("Delete any existing decommission.")
operation ClusterDeleteDecommissionAwareness {
    input: ClusterDeleteDecommissionAwareness_Input,
    output: ClusterDeleteDecommissionAwareness_Output
}
