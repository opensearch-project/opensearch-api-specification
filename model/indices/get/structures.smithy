// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesGet_QueryParams {
    @httpQuery("local")
    @default(false)
    local: Local,

    @httpQuery("ignore_unavailable")
    @default(false)
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    @default(false)
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("flat_settings")
    @default(false)
    flat_settings: FlatSettings,

    @httpQuery("include_defaults")
    @documentation("Whether to return all default setting for each of the indices.")
    @default(false)
    include_defaults: IncludeDefaults,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}


@input
structure IndicesGet_Input with [IndicesGet_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices.")
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure IndicesGet_Output {}
