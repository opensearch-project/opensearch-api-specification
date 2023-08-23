// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cluster-api/cluster-settings/"
)

@xOperationGroup("cluster.get_settings")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/settings")
@documentation("Returns cluster settings.")
operation ClusterGetSettings {
    input: ClusterGetSettings_Input,
    output: ClusterGetSettings_Output
}

apply ClusterGetSettings @examples([
    {
        title: "Examples for Get cluster settings Operation.",
        input: {
            include_defaults: true
        }
    }
])
