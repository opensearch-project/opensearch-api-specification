// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterDeleteVotingConfigExclusions_QueryParams {
    @httpQuery("wait_for_removal")
    @default(true)
    wait_for_removal: WaitForRemoval,
}


@input
structure ClusterDeleteVotingConfigExclusions_Input with [ClusterDeleteVotingConfigExclusions_QueryParams] {
}

// TODO: Fill in Output Structure
structure ClusterDeleteVotingConfigExclusions_Output {}
