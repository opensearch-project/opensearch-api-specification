// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure DanglingIndicesDeleteDanglingIndex_QueryParams {
    @httpQuery("accept_data_loss")
    @documentation("Must be set to true in order to delete the dangling index.")
    accept_data_loss: AcceptDataLoss,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}


@input
structure DanglingIndicesDeleteDanglingIndex_Input with [DanglingIndicesDeleteDanglingIndex_QueryParams] {
    @required
    @httpLabel
    index_uuid: PathIndexUuid,
}

// TODO: Fill in Output Structure
structure DanglingIndicesDeleteDanglingIndex_Output {}
