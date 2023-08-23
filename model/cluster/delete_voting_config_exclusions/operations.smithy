// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@xOperationGroup("cluster.delete_voting_config_exclusions")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_cluster/voting_config_exclusions")
@documentation("Clears cluster voting config exclusions.")
operation ClusterDeleteVotingConfigExclusions {
    input: ClusterDeleteVotingConfigExclusions_Input,
    output: ClusterDeleteVotingConfigExclusions_Output
}
