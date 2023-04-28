// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure SnapshotVerifyRepository_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("timeout")
    timeout: Timeout,
}

// TODO: Fill in Body Parameters
structure SnapshotVerifyRepository_BodyParams {}

@input
structure SnapshotVerifyRepository_Input with [SnapshotVerifyRepository_QueryParams] {
    @required
    @httpLabel
    repository: PathRepository,
    @httpPayload
    content: SnapshotVerifyRepository_BodyParams,
}

// TODO: Fill in Output Structure
structure SnapshotVerifyRepository_Output {}
