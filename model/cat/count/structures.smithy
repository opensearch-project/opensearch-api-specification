// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatCount_QueryParams {
    @httpQuery("format")
    format: Format,

    @httpQuery("h")
    h: H,

    @httpQuery("help")
    @default(false)
    help: Help,

    @httpQuery("s")
    s: S,

    @httpQuery("v")
    @default(false)
    v: V,
}


@input
structure CatCount_Input with [CatCount_QueryParams] {
}

@input
structure CatCount_WithIndex_Input with [CatCount_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of indices to limit the returned information.")
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure CatCount_Output {}
