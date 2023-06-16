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
    bytes: Bytes,

    @httpQuery("format")
    format: Format,

    @httpQuery("full_id")
    @default(false)
    full_id: FullId,

    @httpQuery("local")
    @default(false)
    @deprecated
    @vendorExtensions(
        "x-deprecation-message": "This parameter does not cause this API to act locally.",
        "x-version-deprecated": "1.0",
    )
    local: Local,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("h")
    h: H,

    @httpQuery("help")
    @default(false)
    help: Help,

    @httpQuery("s")
    s: S,

    @httpQuery("time")
    time: Time,

    @httpQuery("v")
    @default(false)
    v: V,
}


@input
structure CatNodes_Input with [CatNodes_QueryParams] {
}

// TODO: Fill in Output Structure
structure CatNodes_Output {
    // In the Cat Nodes API, the dot operator is used to name a few fields.
    // Smithy does not yet support this naming standard.
    // It needs to be modified once we have support for the dot operator.
}
