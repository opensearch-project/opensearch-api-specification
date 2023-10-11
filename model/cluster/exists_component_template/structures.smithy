// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterExistsComponentTemplate_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("local")
    @default(false)
    local: Local,
}


@input
structure ClusterExistsComponentTemplate_Input with [ClusterExistsComponentTemplate_QueryParams] {
    @required
    @httpLabel
    name: PathTemplateName,
}

// TODO: Fill in Output Structure
structure ClusterExistsComponentTemplate_Output {}
