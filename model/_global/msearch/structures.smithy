// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@mixin
structure Msearch_QueryParams {
    @httpQuery("search_type")
    search_type: SearchTypeMulti,

    @httpQuery("max_concurrent_searches")
    max_concurrent_searches: MaxConcurrentSearches,

    @httpQuery("typed_keys")
    typed_keys: TypedKeys,

    @httpQuery("pre_filter_shard_size")
    pre_filter_shard_size: PreFilterShardSize,

    @httpQuery("max_concurrent_shard_requests")
    @documentation("The number of concurrent shard requests each sub search executes concurrently per node. This value should be used to limit the impact of the search on the cluster in order to limit the number of concurrent shard requests.")
    @default(5)
    max_concurrent_shard_requests: MaxConcurrentShardRequests,

    @httpQuery("rest_total_hits_as_int")
    @default(false)
    rest_total_hits_as_int: RestTotalHitsAsInt,

    @httpQuery("ccs_minimize_roundtrips")
    @default(true)
    ccs_minimize_roundtrips: CcsMinimizeRoundtrips,
}

// TODO: Fill in Body Parameters
@vendorExtensions(
    "x-serialize": "bulk"
)
structure Msearch_BodyParams {}

@input
structure Msearch_Get_Input with [Msearch_QueryParams] {
}

@input
structure Msearch_Post_Input with [Msearch_QueryParams] {
    @required
    @httpPayload
    content: Msearch_BodyParams,
}

@input
structure Msearch_Get_WithIndex_Input with [Msearch_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to use as default.")
    index: PathIndices,
}

@input
structure Msearch_Post_WithIndex_Input with [Msearch_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to use as default.")
    index: PathIndices,
    @required
    @httpPayload
    content: Msearch_BodyParams,
}

// TODO: Fill in Output Structure
structure Msearch_Output {}
