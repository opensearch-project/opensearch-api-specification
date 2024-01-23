// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesOptionsQueryParams {
    @httpQuery("allow_no_indices")
    allow_no_indices: AllowNoIndices,

    @httpQuery("expand_wildcards")
    expand_wildcards: ExpandWildcards,

    @httpQuery("ignore_throttled")
    ignore_throttled: IgnoreThrottled,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: IgnoreUnavailable,
}
