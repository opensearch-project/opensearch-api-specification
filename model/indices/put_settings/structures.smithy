// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesPutSettings_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("preserve_existing")
    @default(false)
    preserve_existing: PreserveExisting,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("flat_settings")
    @default(false)
    flat_settings: FlatSettings,
}

// TODO: Fill in Body Parameters
structure IndicesPutSettings_BodyParams {}

@input
structure IndicesPutSettings_Input with [IndicesPutSettings_QueryParams] {
    @required
    @httpPayload
    content: IndicesPutSettings_BodyParams,
}

@input
structure IndicesPutSettings_WithIndex_Input with [IndicesPutSettings_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
    @required
    @httpPayload
    content: IndicesPutSettings_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesPutSettings_Output {}
