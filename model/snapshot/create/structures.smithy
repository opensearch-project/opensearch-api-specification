// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure SnapshotCreate_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("wait_for_completion")
    @default(false)
    wait_for_completion: WaitForCompletionFalse,
}

// TODO: Fill in Body Parameters
structure SnapshotCreate_BodyParams {}

@input
structure SnapshotCreate_Put_Input with [SnapshotCreate_QueryParams] {
    @required
    @httpLabel
    repository: PathRepository,

    @required
    @httpLabel
    snapshot: PathSnapshot,
    @httpPayload
    content: SnapshotCreate_BodyParams,
}

@input
structure SnapshotCreate_Post_Input with [SnapshotCreate_QueryParams] {
    @required
    @httpLabel
    repository: PathRepository,

    @required
    @httpLabel
    snapshot: PathSnapshot,
    @httpPayload
    content: SnapshotCreate_BodyParams,
}

// TODO: Fill in Output Structure
structure SnapshotCreate_Output {}
