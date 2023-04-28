// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterPendingTasks_QueryParams {
    @httpQuery("local")
    @default(false)
    local: Local,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}


@input
structure ClusterPendingTasks_Input with [ClusterPendingTasks_QueryParams] {
}

// TODO: Fill in Output Structure
structure ClusterPendingTasks_Output {}
