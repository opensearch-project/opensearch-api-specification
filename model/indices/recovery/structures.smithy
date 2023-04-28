// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesRecovery_QueryParams {
    @httpQuery("detailed")
    @documentation("Whether to display detailed information about shard recovery.")
    @default(false)
    detailed: Detailed,

    @httpQuery("active_only")
    @documentation("Display only those recoveries that are currently on-going.")
    @default(false)
    active_only: ActiveOnly,
}


@input
structure IndicesRecovery_Input with [IndicesRecovery_QueryParams] {
}

@input
structure IndicesRecovery_WithIndex_Input with [IndicesRecovery_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure IndicesRecovery_Output {}
