// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterReroute_QueryParams {
    @httpQuery("dry_run")
    dry_run: ClusterRerouteDryRun,

    @httpQuery("explain")
    @documentation("Return an explanation of why the commands can or cannot be executed.")
    explain: Explain,

    @httpQuery("retry_failed")
    retry_failed: RetryFailed,

    @httpQuery("metric")
    metric: ClusterRerouteMetric,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("timeout")
    timeout: Timeout,
}

// TODO: Fill in Body Parameters
structure ClusterReroute_BodyParams {}

@input
structure ClusterReroute_Input with [ClusterReroute_QueryParams] {
    @httpPayload
    content: ClusterReroute_BodyParams,
}

// TODO: Fill in Output Structure
structure ClusterReroute_Output {}
