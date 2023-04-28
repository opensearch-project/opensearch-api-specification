// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure DeleteScript_QueryParams {
    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}


@input
structure DeleteScript_Input with [DeleteScript_QueryParams] {
    @required
    @httpLabel
    id: PathScriptId,
}

// TODO: Fill in Output Structure
structure DeleteScript_Output {}
