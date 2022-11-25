// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure GetCatNodesInput {

    // GetCatNodesInput Start

    @httpQuery("bytes")
    bytes: Byte,

    @httpQuery("full_id")
    full_id: Boolean,

    @httpQuery("local")
    local: Boolean,

    @deprecated(since: "2.0.0", message: "To promote inclusive language, use 'cluster_manager_timeout' instead.")
    @httpQuery("master_timeout")
    master_timeout: Time,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: Time,

    @httpQuery("time")
    time: Time,

    @httpQuery("include_unloaded_segments")
    include_unloaded_segments: Boolean,

    @httpQuery("format")
    format: String

    // GetCatNodesInput End

}

structure GetCatNodesOutput {

// In the Cat Nodes API, the dot operator is used to name a few fields.
// Smithy does not yet support this naming standard.
// It needs to be modified once we have support for the dot operator.

    @httpPayload
    content: Document

}
