// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure SnapshotGetRepository_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("local")
    @default(false)
    local: Local,
}


@input
structure SnapshotGetRepository_Input with [SnapshotGetRepository_QueryParams] {
}

@input
structure SnapshotGetRepository_WithRepository_Input with [SnapshotGetRepository_QueryParams] {
    @required
    @httpLabel
    repository: PathRepositories,
}

// TODO: Fill in Output Structure
structure SnapshotGetRepository_Output {}
