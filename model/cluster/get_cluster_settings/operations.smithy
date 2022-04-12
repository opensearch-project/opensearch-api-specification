// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

@externalDocumentation(
    "OpenSearch Documentation": "https://opensearch.org/docs/latest/opensearch/rest-api/cluster-settings/"
)

@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/settings")
@documentation("Returns cluster settings.")
operation GetClusterSettings {
    input: GetClusterSettingsInput,
    output: GetClusterSettingsOutput
}
