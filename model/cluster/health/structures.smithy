// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterHealth_QueryParams {
    @httpQuery("expand_wildcards")
    @default("all")
    expand_wildcards: ExpandWildcards,

    @httpQuery("level")
    @default("cluster")
    level: ClusterHealthLevel,

    @httpQuery("local")
    @default(false)
    local: Local,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("wait_for_active_shards")
    @documentation("Wait until the specified number of shards is active.")
    wait_for_active_shards: WaitForActiveShards,

    @httpQuery("wait_for_nodes")
    wait_for_nodes: WaitForNodes,

    @httpQuery("wait_for_events")
    wait_for_events: WaitForEvents,

    @httpQuery("wait_for_no_relocating_shards")
    wait_for_no_relocating_shards: WaitForNoRelocatingShards,

    @httpQuery("wait_for_no_initializing_shards")
    wait_for_no_initializing_shards: WaitForNoInitializingShards,

    @httpQuery("wait_for_status")
    wait_for_status: WaitForStatus,

    @httpQuery("awareness_attribute")
    awareness_attribute: AwarenessAttribute,
}


@input
structure ClusterHealth_Input with [ClusterHealth_QueryParams] {
}

@input
structure ClusterHealth_WithIndex_Input with [ClusterHealth_QueryParams] {
    @required
    @httpLabel
    @documentation("Limit the information returned to specific indicies.")
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure ClusterHealth_Output {}
