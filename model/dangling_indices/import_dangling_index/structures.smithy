// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure DanglingIndicesImportDanglingIndex_QueryParams {
    @httpQuery("accept_data_loss")
    @documentation("Must be set to true in order to import the dangling index.")
    accept_data_loss: AcceptDataLoss,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}

// TODO: Fill in Body Parameters
structure DanglingIndicesImportDanglingIndex_BodyParams {}

@input
structure DanglingIndicesImportDanglingIndex_Input with [DanglingIndicesImportDanglingIndex_QueryParams] {
    @required
    @httpLabel
    index_uuid: PathIndexUuid,
    @httpPayload
    content: DanglingIndicesImportDanglingIndex_BodyParams,
}

// TODO: Fill in Output Structure
structure DanglingIndicesImportDanglingIndex_Output {}
