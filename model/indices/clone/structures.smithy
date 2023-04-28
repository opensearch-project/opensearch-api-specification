// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesClone_QueryParams {
    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("wait_for_active_shards")
    @documentation("Set the number of active shards to wait for on the cloned index before the operation returns.")
    wait_for_active_shards: WaitForActiveShards,
}

// TODO: Fill in Body Parameters
structure IndicesClone_BodyParams {}

@input
structure IndicesClone_Put_Input with [IndicesClone_QueryParams] {
    @required
    @httpLabel
    @documentation("The name of the source index to clone.")
    index: PathIndex,

    @required
    @httpLabel
    target: PathTarget,
    @httpPayload
    content: IndicesClone_BodyParams,
}

@input
structure IndicesClone_Post_Input with [IndicesClone_QueryParams] {
    @required
    @httpLabel
    @documentation("The name of the source index to clone.")
    index: PathIndex,

    @required
    @httpLabel
    target: PathTarget,
    @httpPayload
    content: IndicesClone_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesClone_Output {}
