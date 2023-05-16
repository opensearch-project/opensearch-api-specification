// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesGetSettings_QueryParams {
    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("all")
    expand_wildcards: ExpandWildcards,

    @httpQuery("flat_settings")
    @default(false)
    flat_settings: FlatSettings,

    @httpQuery("local")
    @default(false)
    local: Local,

    @httpQuery("include_defaults")
    @documentation("Whether to return all default setting for each of the indices.")
    @default(false)
    include_defaults: IncludeDefaults,
}


@input
structure IndicesGetSettings_Input with [IndicesGetSettings_QueryParams] {
}

@input
structure IndicesGetSettings_WithIndex_Input with [IndicesGetSettings_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

@input
structure IndicesGetSettings_WithName_Input with [IndicesGetSettings_QueryParams] {
    @required
    @httpLabel
    name: PathSettingNames,
}

@input
structure IndicesGetSettings_WithIndexName_Input with [IndicesGetSettings_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,

    @required
    @httpLabel
    name: PathSettingNames,
}

// TODO: Fill in Output Structure
structure IndicesGetSettings_Output {}
