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
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("write_index_only")
    @default(false)
    write_index_only: WriteIndexOnly,
}

// TODO: Fill in Body Parameters
structure IndicesPutMapping_BodyParams {}

@input
structure IndicesPutMapping_Put_Input with [IndicesPutMapping_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
    @httpPayload
    content: IndicesPutMapping_BodyParams,
}

@input
structure IndicesPutMapping_Post_Input with [IndicesPutMapping_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
    @httpPayload
    content: IndicesPutMapping_BodyParams,
}

structure IndicesPutMapping_Output {
    acknowledged: Boolean
}
