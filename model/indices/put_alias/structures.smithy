// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesPutAlias_QueryParams {
    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}

// TODO: Fill in Body Parameters
structure IndicesPutAlias_BodyParams {}

@input
structure IndicesPutAlias_Put_Input with [IndicesPutAlias_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,

    @required
    @httpLabel
    name: PathAliasName,
    @httpPayload
    content: IndicesPutAlias_BodyParams,
}

@input
structure IndicesPutAlias_Post_Input with [IndicesPutAlias_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,

    @required
    @httpLabel
    name: PathAliasName,
    @httpPayload
    content: IndicesPutAlias_BodyParams,
}

@input
structure IndicesPutAlias_Put_Input with [IndicesPutAlias_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,

    @required
    @httpLabel
    name: PathAliasName,
    @httpPayload
    content: IndicesPutAlias_BodyParams,
}

@input
structure IndicesPutAlias_Post_Input with [IndicesPutAlias_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,

    @required
    @httpLabel
    name: PathAliasName,
    @httpPayload
    content: IndicesPutAlias_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesPutAlias_Output {}
