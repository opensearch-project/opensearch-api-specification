// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesPutTemplate_QueryParams {
    @httpQuery("order")
    order: Order,

    @httpQuery("create")
    @default(false)
    create: Create,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}

// TODO: Fill in Body Parameters
@documentation("The template definition")
structure IndicesPutTemplate_BodyParams {}

@input
structure IndicesPutTemplate_Put_Input with [IndicesPutTemplate_QueryParams] {
    @required
    @httpLabel
    name: PathTemplateName,
    @required
    @httpPayload
    content: IndicesPutTemplate_BodyParams,
}

@input
structure IndicesPutTemplate_Post_Input with [IndicesPutTemplate_QueryParams] {
    @required
    @httpLabel
    name: PathTemplateName,
    @required
    @httpPayload
    content: IndicesPutTemplate_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesPutTemplate_Output {}
