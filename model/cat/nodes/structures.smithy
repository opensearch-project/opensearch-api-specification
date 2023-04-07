// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@mixin
structure CatNodes_QueryParams {
    @httpQuery("bytes")
    query_bytes: Bytes,

    @httpQuery("format")
    query_format: Format,

    @httpQuery("full_id")
    @default(false)
    query_full_id: FullId,

    @httpQuery("local")
    @default(false)
    @deprecated
    @vendorExtensions(
        "x-deprecation-message": "",
        "x-version-deprecated": ""
    )
    query_local: Local,

    @httpQuery("master_timeout")
    query_master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    query_cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("h")
    query_h: H,

    @httpQuery("help")
    @default(false)
    query_help: Help,

    @httpQuery("s")
    query_s: S,

    @httpQuery("time")
    query_time: Time,

    @httpQuery("v")
    @default(false)
    query_v: V,
}


@input
structure CatNodes_Input with [CatNodes_QueryParams] {
}

// TODO: Fill in Output Structure
structure CatNodes_Output {
    // In the Cat Nodes API, the dot operator is used to name a few fields.
    // Smithy does not yet support this naming standard.
    // It needs to be modified once we have support for the dot operator.

    @httpPayload
    content: Document
}
