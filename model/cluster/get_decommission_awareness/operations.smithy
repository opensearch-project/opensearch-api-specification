// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cluster-api/cluster-decommission/#example-getting-zone-decommission-status"
)

@vendorExtensions(
    "x-operation-group": "cluster.get_decommission_awareness",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/decommission/awareness/{awareness_attribute_name}/_status")
@documentation("Get details and status of decommissioned attribute.")
operation ClusterGetDecommissionAwareness {
    input: ClusterGetDecommissionAwareness_Input,
    output: ClusterGetDecommissionAwareness_Output
}
