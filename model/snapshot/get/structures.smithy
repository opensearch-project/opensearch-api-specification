// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure SnapshotGet_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("ignore_unavailable")
    @default(false)
    ignore_unavailable: DfExplainSnapshot,

    @httpQuery("verbose")
    @documentation("Whether to show verbose snapshot info or only show the basic info found in the repository index blob.")
    verbose: Verbose,
}


@input
structure SnapshotGet_Input with [SnapshotGet_QueryParams] {
    @required
    @httpLabel
    repository: PathRepository,

    @required
    @httpLabel
    snapshot: PathSnapshots,
}

// TODO: Fill in Output Structure
structure SnapshotGet_Output {}
