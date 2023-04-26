// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterGetSettings_QueryParams {
    @httpQuery("flat_settings")
    @default(false)
    flat_settings: FlatSettings,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("include_defaults")
    @documentation("Whether to return all default clusters setting.")
    @default(false)
    include_defaults: IncludeDefaults,
}


@input
structure ClusterGetSettings_Input with [ClusterGetSettings_QueryParams] {
}

structure ClusterGetSettings_Output {
    persistent: UserDefinedValueMap,

    transient: UserDefinedValueMap,

    defaults: UserDefinedValueMap,
}
