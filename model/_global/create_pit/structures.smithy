// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CreatePit_QueryParams {
    @httpQuery("allow_partial_pit_creation")
    allow_partial_pit_creation: AllowPartialPitCreation,

    @httpQuery("keep_alive")
    keep_alive: KeepAlive,

    @httpQuery("preference")
    @default("random")
    preference: Preference,

    @httpQuery("routing")
    routing: Routings,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards
}

@input
structure CreatePit_Input with [CreatePit_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

@output
structure CreatePit_Output {
    pit_id: String,
    _shard: ShardStatistics,
    creation_time: Long
}
