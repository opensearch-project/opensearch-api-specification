// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cluster-settings/"
)

@vendorExtensions(
    "x-operation-group": "cluster.put_settings",
    "x-version-added": "1.0"
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_cluster/settings")
@documentation("Updates the cluster settings.")
operation ClusterPutSettings {
    input: ClusterPutSettings_Input,
    output: ClusterPutSettings_Output
}
