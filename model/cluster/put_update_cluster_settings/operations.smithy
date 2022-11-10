// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "OpenSearch Documentation": "https://opensearch.org/docs/latest/api-reference/cluster-settings/"
)

@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_cluster/settings")
@documentation("Updates the cluster settings.")
operation PutUpdateClusterSettings {
    input: PutUpdateClusterSettingsInput,
    output: PutUpdateClusterSettingsOutput
}
