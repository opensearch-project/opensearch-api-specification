// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesPutIndexTemplate_QueryParams {
    @httpQuery("create")
    @default(false)
    create: Create,

    @httpQuery("cause")
    @documentation("User defined reason for creating/updating the index template.")
    @default("false")
    cause: Cause,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}

// TODO: Fill in Body Parameters
structure IndicesPutIndexTemplate_BodyParams {}

@input
structure IndicesPutIndexTemplate_Put_Input with [IndicesPutIndexTemplate_QueryParams] {
    @required
    @httpLabel
    name: PathTemplateName,
    @httpPayload
    content: IndicesPutIndexTemplate_BodyParams,
}

@input
structure IndicesPutIndexTemplate_Post_Input with [IndicesPutIndexTemplate_QueryParams] {
    @required
    @httpLabel
    name: PathTemplateName,
    @httpPayload
    content: IndicesPutIndexTemplate_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesPutIndexTemplate_Output {}
