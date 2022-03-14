// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
// 

namespace OpenSearch

structure GetCatIndicesInput {
    // Common options to be removed by mixins start

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
    // Common options end

}

structure GetCatIndicesOutput {

   @required
   body:Document

}

structure GetCatIndicesWithIndexInput {
    @httpLabel
    @required
    index: IndexName,

    // Common options to be removed by mixins start

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
    // Common options end

}


structure GetCatIndicesWithIndexOutput {
    @required
    index: IndexName, 

    @required
    body: Document

}
