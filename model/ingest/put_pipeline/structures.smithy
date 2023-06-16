// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IngestPutPipeline_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("timeout")
    timeout: Timeout,
}

// TODO: Fill in Body Parameters
structure IngestPutPipeline_BodyParams {}

@input
structure IngestPutPipeline_Input with [IngestPutPipeline_QueryParams] {
    @required
    @httpLabel
    id: PathPipelineId,
    @required
    @httpPayload
    content: IngestPutPipeline_BodyParams,
}

// TODO: Fill in Output Structure
structure IngestPutPipeline_Output {}
