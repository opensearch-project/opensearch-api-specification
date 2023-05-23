// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure SnapshotDeleteRepository_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("timeout")
    timeout: Timeout,
}


@input
structure SnapshotDeleteRepository_Input with [SnapshotDeleteRepository_QueryParams] {
    @required
    @httpLabel
    @documentation("Name of the snapshot repository to unregister. Wildcard (`*`) patterns are supported.")
    repository: PathRepositories,
}

// TODO: Fill in Output Structure
structure SnapshotDeleteRepository_Output {}
