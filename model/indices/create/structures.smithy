// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesCreate_QueryParams {
    @httpQuery("wait_for_active_shards")
    @documentation("Set the number of active shards to wait for before the operation returns.")
    wait_for_active_shards: WaitForActiveShards,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}

structure IndicesCreate_BodyParams {
    //TODO: Placeholders. aliases, mapping and settings need to be updated with proper structures

    aliases: UserDefinedValueMap,

    mapping: UserDefinedValueMap,

    settings: UserDefinedValueMap
}

@input
structure IndicesCreate_Input with [IndicesCreate_QueryParams] {
    @required
    @httpLabel
    index: PathIndex,
    @httpPayload
    content: IndicesCreate_BodyParams,
}


structure IndicesCreate_Output {
    @required
    index: Index,

    @required
    shards_acknowledged: Boolean,

    @required
    acknowledged: Boolean
}
