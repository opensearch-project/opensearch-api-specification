// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure SnapshotRestore_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("wait_for_completion")
    @default(false)
    wait_for_completion: WaitForCompletionFalse,
}

// TODO: Fill in Body Parameters
@documentation("Details of what to restore")
structure SnapshotRestore_BodyParams {}

@input
structure SnapshotRestore_Input with [SnapshotRestore_QueryParams] {
    @required
    @httpLabel
    repository: PathRepository,

    @required
    @httpLabel
    snapshot: PathSnapshot,
    @httpPayload
    content: SnapshotRestore_BodyParams,
}

// TODO: Fill in Output Structure
structure SnapshotRestore_Output {}
