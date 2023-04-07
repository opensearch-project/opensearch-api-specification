// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterPutSettings_QueryParams {
    @httpQuery("flat_settings")
    @default(false)
    query_flat_settings: FlatSettings,

    @httpQuery("master_timeout")
    query_master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    query_cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("timeout")
    query_timeout: Timeout,
}

@mixin
structure ClusterPutSettings_BodyParams {
    persistent: UserDefinedValueMap,

    transient: UserDefinedValueMap
}

@input
structure ClusterPutSettings_Input with [ClusterPutSettings_QueryParams, ClusterPutSettings_BodyParams] {
}

structure ClusterPutSettings_Output {
    acknowledged: Boolean,

    persistent: UserDefinedValueMap,

    transient: UserDefinedValueMap
}
