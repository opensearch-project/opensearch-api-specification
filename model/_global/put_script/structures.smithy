// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure PutScript_QueryParams {
    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}

// TODO: Fill in Body Parameters
@documentation("The document")
structure PutScript_BodyParams {}

@input
structure PutScript_Put_Input with [PutScript_QueryParams] {
    @required
    @httpLabel
    id: PathScriptId,
    @required
    @httpPayload
    content: PutScript_BodyParams,
}

@input
structure PutScript_Post_Input with [PutScript_QueryParams] {
    @required
    @httpLabel
    id: PathScriptId,
    @required
    @httpPayload
    content: PutScript_BodyParams,
}

@input
structure PutScript_Put_WithContext_Input with [PutScript_QueryParams] {
    @required
    @httpLabel
    id: PathScriptId,

    @required
    @httpLabel
    context: PathContext,
    @required
    @httpPayload
    content: PutScript_BodyParams,
}

@input
structure PutScript_Post_WithContext_Input with [PutScript_QueryParams] {
    @required
    @httpLabel
    id: PathScriptId,

    @required
    @httpLabel
    context: PathContext,
    @required
    @httpPayload
    content: PutScript_BodyParams,
}

// TODO: Fill in Output Structure
structure PutScript_Output {}
