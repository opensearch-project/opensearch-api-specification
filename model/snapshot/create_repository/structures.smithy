// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure SnapshotCreateRepository_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("verify")
    verify: Verify,
}

// TODO: Fill in Body Parameters
structure SnapshotCreateRepository_BodyParams {}

@input
structure SnapshotCreateRepository_Put_Input with [SnapshotCreateRepository_QueryParams] {
    @required
    @httpLabel
    repository: PathRepository,
    @required
    @httpPayload
    content: SnapshotCreateRepository_BodyParams,
}

@input
structure SnapshotCreateRepository_Post_Input with [SnapshotCreateRepository_QueryParams] {
    @required
    @httpLabel
    repository: PathRepository,
    @required
    @httpPayload
    content: SnapshotCreateRepository_BodyParams,
}

// TODO: Fill in Output Structure
structure SnapshotCreateRepository_Output {}
