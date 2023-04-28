// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterGetComponentTemplate_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("local")
    @default(false)
    local: Local,
}


@input
structure ClusterGetComponentTemplate_Input with [ClusterGetComponentTemplate_QueryParams] {
}

@input
structure ClusterGetComponentTemplate_WithName_Input with [ClusterGetComponentTemplate_QueryParams] {
    @required
    @httpLabel
    name: PathComponentTemplateNames,
}

// TODO: Fill in Output Structure
structure ClusterGetComponentTemplate_Output {}
