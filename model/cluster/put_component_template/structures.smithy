// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterPutComponentTemplate_QueryParams {
    @httpQuery("create")
    @default(false)
    create: Create,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}

// TODO: Fill in Body Parameters
structure ClusterPutComponentTemplate_BodyParams {}

@input
structure ClusterPutComponentTemplate_Put_Input with [ClusterPutComponentTemplate_QueryParams] {
    @required
    @httpLabel
    name: PathTemplateName,
    @httpPayload
    content: ClusterPutComponentTemplate_BodyParams,
}

@input
structure ClusterPutComponentTemplate_Post_Input with [ClusterPutComponentTemplate_QueryParams] {
    @required
    @httpLabel
    name: PathTemplateName,
    @httpPayload
    content: ClusterPutComponentTemplate_BodyParams,
}

// TODO: Fill in Output Structure
structure ClusterPutComponentTemplate_Output {}
