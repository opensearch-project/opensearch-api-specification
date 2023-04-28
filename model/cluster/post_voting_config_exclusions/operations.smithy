// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@vendorExtensions(
    "x-operation-group": "cluster.post_voting_config_exclusions",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_cluster/voting_config_exclusions")
@documentation("Updates the cluster voting config exclusions by node ids or node names.")
operation ClusterPostVotingConfigExclusions {
    input: ClusterPostVotingConfigExclusions_Input,
    output: ClusterPostVotingConfigExclusions_Output
}
