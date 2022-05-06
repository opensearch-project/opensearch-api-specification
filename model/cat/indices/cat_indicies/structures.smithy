// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
// 

namespace OpenSearch

structure GetCatIndicesInput {
    // GetCatIndicesInputCommonParameters Start

    @httpQuery("bytes")
    bytes: Byte,

    @httpQuery("expand_wildcards")
    expand_wildcards: ExpandWildcards,

    @httpQuery("health")
    health: HealthStatus,

    @httpQuery("include_unloaded_segments")
    include_unloaded_segments: Boolean,

    @httpQuery("pri")
    pri: Boolean,

    @httpQuery("master_timeout")
    master_timeout: Time,

    @httpQuery("timeout")
    timeout: Time
    // GetCatIndicesInputCommonParameters end

}

structure GetCatIndicesOutput {

    @httpPayload
    content: Document

}

structure GetCatIndicesWithIndexInput {
    @httpLabel
    @required
    index: IndexName,

    // GetCatIndicesIndexInputCommonParameters Start

    @httpQuery("bytes")
    bytes: Byte,

    @httpQuery("expand_wildcards")
    expand_wildcards: ExpandWildcards,

    @httpQuery("health")
    health: HealthStatus,

    @httpQuery("include_unloaded_segments")
    include_unloaded_segments: Boolean,

    @httpQuery("pri")
    pri: Boolean,

    @httpQuery("master_timeout")
    master_timeout: Time,

    @httpQuery("timeout")
    timeout: Time
    // GetCatIndicesIndexInputCommonParameters End

}


structure GetCatIndicesWithIndexOutput {

    @httpPayload
    content: Document

}
