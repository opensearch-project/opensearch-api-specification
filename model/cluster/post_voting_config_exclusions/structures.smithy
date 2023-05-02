// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterPostVotingConfigExclusions_QueryParams {
    @httpQuery("node_ids")
    node_ids: NodeIds,

    @httpQuery("node_names")
    node_names: NodeNames,

    @httpQuery("timeout")
    timeout: Timeout,
}


@input
structure ClusterPostVotingConfigExclusions_Input with [ClusterPostVotingConfigExclusions_QueryParams] {
}

// TODO: Fill in Output Structure
structure ClusterPostVotingConfigExclusions_Output {}
