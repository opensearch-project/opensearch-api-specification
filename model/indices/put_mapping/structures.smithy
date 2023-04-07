// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesPutMapping_QueryParams {
    @httpQuery("timeout")
    query_timeout: Timeout,

    @httpQuery("master_timeout")
    query_master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    query_cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("ignore_unavailable")
    query_ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    query_allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    query_expand_wildcards: ExpandWildcards,

    @httpQuery("write_index_only")
    @default(false)
    query_write_index_only: WriteIndexOnly,
}

// TODO: Fill in Body Parameters
@mixin
structure IndicesPutMapping_BodyParams {}

@input
structure IndicesPutMapping_Put_Input with [IndicesPutMapping_QueryParams, IndicesPutMapping_BodyParams] {
    @required
    @httpLabel
    index: PathIndices,
}

@input
structure IndicesPutMapping_Post_Input with [IndicesPutMapping_QueryParams, IndicesPutMapping_BodyParams] {
    @required
    @httpLabel
    index: PathIndices,
}

structure IndicesPutMapping_Output {
    acknowledged: Boolean
}
