// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure SnapshotClone_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}

// TODO: Fill in Body Parameters
structure SnapshotClone_BodyParams {}

@input
structure SnapshotClone_Input with [SnapshotClone_QueryParams] {
    @required
    @httpLabel
    repository: PathRepository,

    @required
    @httpLabel
    snapshot: PathSnapshot,

    @required
    @httpLabel
    target_snapshot: PathTargetSnapshot,
    @httpPayload
    content: SnapshotClone_BodyParams,
}

// TODO: Fill in Output Structure
structure SnapshotClone_Output {}
