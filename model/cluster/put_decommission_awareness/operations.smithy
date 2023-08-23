// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cluster-api/cluster-decommission/#example-decommissioning-and-recommissioning-a-zone"
)

@xOperationGroup("cluster.put_decommission_awareness")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_cluster/decommission/awareness/{awareness_attribute_name}/{awareness_attribute_value}")
@documentation("Decommissions an awareness attribute.")
operation ClusterPutDecommissionAwareness {
    input: ClusterPutDecommissionAwareness_Input,
    output: ClusterPutDecommissionAwareness_Output
}
