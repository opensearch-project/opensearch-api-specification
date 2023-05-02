// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@mixin
structure IndicesGetMapping_QueryParams {
    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("local")
    @default(false)
    @deprecated
    @vendorExtensions(
        "x-deprecation-message": "This parameter is a no-op and field mappings are always retrieved locally.",
        "x-version-deprecated": "1.0.0"
    )
    local: Local,
}


@input
structure IndicesGetMapping_Input with [IndicesGetMapping_QueryParams] {
}

@input
structure IndicesGetMapping_WithIndex_Input with [IndicesGetMapping_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices.")
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure IndicesGetMapping_Output {}
