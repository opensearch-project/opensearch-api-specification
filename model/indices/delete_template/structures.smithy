// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesDeleteTemplate_QueryParams {
    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}


@input
structure IndicesDeleteTemplate_Input with [IndicesDeleteTemplate_QueryParams] {
    @required
    @httpLabel
    name: PathTemplateName,
}

// TODO: Fill in Output Structure
structure IndicesDeleteTemplate_Output {}
