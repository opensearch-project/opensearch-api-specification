// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure SnapshotStatus_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("ignore_unavailable")
    @default(false)
    ignore_unavailable: DfExplainSnapshot,
}


@input
structure SnapshotStatus_Input with [SnapshotStatus_QueryParams] {
}

@input
structure SnapshotStatus_WithRepository_Input with [SnapshotStatus_QueryParams] {
    @required
    @httpLabel
    repository: PathRepository,
}

@input
structure SnapshotStatus_WithRepositorySnapshot_Input with [SnapshotStatus_QueryParams] {
    @required
    @httpLabel
    repository: PathRepository,

    @required
    @httpLabel
    snapshot: PathSnapshots,
}

// TODO: Fill in Output Structure
structure SnapshotStatus_Output {}
