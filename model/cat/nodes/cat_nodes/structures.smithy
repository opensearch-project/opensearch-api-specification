// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

structure GetCatNodesInput {

    // Common options to be removed by mixins start

    @httpQuery("bytes")
    bytes: Byte,

    @httpQuery("full_id")
    full_id: Boolean,   

    @httpQuery("local")
    local: Boolean,   

    @httpQuery("master_timeout")
    master_timeout: Time,

    @httpQuery("timeout")
    timeout: Time,

    @httpQuery("include_unloaded_segments")
    include_unloaded_segments: Boolean,

    // Common options end

}

structure GetCatNodesOutput {

    @required
    body: Document,

}
