// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IngestDeletePipeline_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("timeout")
    timeout: Timeout,
}


@input
structure IngestDeletePipeline_Input with [IngestDeletePipeline_QueryParams] {
    @required
    @httpLabel
    id: PathPipelineId,
}

// TODO: Fill in Output Structure
structure IngestDeletePipeline_Output {}
