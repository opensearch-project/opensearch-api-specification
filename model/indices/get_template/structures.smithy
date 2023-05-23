// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesGetTemplate_QueryParams {
    @httpQuery("flat_settings")
    @default(false)
    flat_settings: FlatSettings,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("local")
    @default(false)
    local: Local,
}


@input
structure IndicesGetTemplate_Input with [IndicesGetTemplate_QueryParams] {
}

@input
structure IndicesGetTemplate_WithName_Input with [IndicesGetTemplate_QueryParams] {
    @required
    @httpLabel
    name: PathTemplateNames,
}

// TODO: Fill in Output Structure
structure IndicesGetTemplate_Output {}
