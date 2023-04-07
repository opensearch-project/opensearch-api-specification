// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesDelete_QueryParams {
    @httpQuery("timeout")
    query_timeout: Timeout,

    @httpQuery("master_timeout")
    query_master_timeout: MasterTimeout,

    @httpQuery("ignore_unavailable")
    @default(false)
    query_ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    @default(false)
    query_allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("open")
    query_expand_wildcards: ExpandWildcards,
}


@input
structure IndicesDelete_Input with [IndicesDelete_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to delete; use `_all` or `*` string to delete all indices.")
    index: PathIndices,
}

structure IndicesDelete_Output {
    acknowledged:Boolean
}
