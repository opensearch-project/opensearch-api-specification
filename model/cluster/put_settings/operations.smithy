// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cluster-settings/"
)

@xOperationGroup("cluster.put_settings")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_cluster/settings")
@documentation("Updates the cluster settings.")
operation ClusterPutSettings {
    input: ClusterPutSettings_Input,
    output: ClusterPutSettings_Output
}
