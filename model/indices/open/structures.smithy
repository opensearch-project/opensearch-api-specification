// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesOpen_QueryParams {
    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,

    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    @default("closed")
    expand_wildcards: ExpandWildcards,

    @httpQuery("wait_for_active_shards")
    @documentation("Sets the number of active shards to wait for before the operation returns.")
    wait_for_active_shards: WaitForActiveShards,
}


@input
structure IndicesOpen_Input with [IndicesOpen_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to open.")
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure IndicesOpen_Output {}
