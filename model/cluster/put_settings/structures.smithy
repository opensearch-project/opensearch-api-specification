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
    flat_settings: FlatSettings,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("timeout")
    timeout: Timeout,
}

structure ClusterPutSettings_BodyParams {
    persistent: UserDefinedValueMap,

    transient: UserDefinedValueMap
}

@input
structure ClusterPutSettings_Input with [ClusterPutSettings_QueryParams] {
    @required
    @httpPayload
    content: ClusterPutSettings_BodyParams,
}

structure ClusterPutSettings_Output {
    acknowledged: Boolean,

    persistent: UserDefinedValueMap,

    transient: UserDefinedValueMap
}
