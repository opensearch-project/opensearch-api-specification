// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterState_QueryParams {
    @httpQuery("local")
    @default(false)
    local: Local,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("flat_settings")
    @default(false)
    flat_settings: FlatSettings,

    @httpQuery("wait_for_metadata_version")
    wait_for_metadata_version: WaitForMetadataVersion,

    @httpQuery("wait_for_timeout")
    wait_for_timeout: WaitForTimeout,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,
}


@input
structure ClusterState_Input with [ClusterState_QueryParams] {
}

@input
structure ClusterState_WithMetric_Input with [ClusterState_QueryParams] {
    @required
    @httpLabel
    metric: PathClusterStateMetric,
}

@input
structure ClusterState_WithIndexMetric_Input with [ClusterState_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,

    @required
    @httpLabel
    metric: PathClusterStateMetric,
}

// TODO: Fill in Output Structure
structure ClusterState_Output {}
