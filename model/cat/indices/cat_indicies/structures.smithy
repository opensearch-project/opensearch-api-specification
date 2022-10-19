// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
// 

$version: "2"
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
    timeout: Time,

    @httpQuery("format")
    format: String
    // GetCatIndicesInputCommonParameters end

}

structure GetCatIndicesOutput {

// In the Cat Indices API, the dot operator is used to name a few fields.
// Smithy does not yet support this naming standard.
// It needs to be modified once we have support for the dot operator. 

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
    timeout: Time,

    @httpQuery("format")
    format: String
    // GetCatIndicesIndexInputCommonParameters End

}


structure GetCatIndicesWithIndexOutput {

// In the Cat Indices API, the dot operator is used to name a few fields.
// Smithy does not yet support this naming standard.
// It needs to be modified once we have support for the dot operator. 

    @httpPayload
    content: Document

}

apply GetCatIndicesWithIndex @examples([
    {
        title: "Examples for Cat indices with Index Operation.",
        input: {
            index: "books",
        }
    }
])

