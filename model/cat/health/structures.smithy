// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatHealth_QueryParams {
    @httpQuery("format")
    format: Format,

    @httpQuery("h")
    h: H,

    @httpQuery("help")
    @default(false)
    help: Help,

    @httpQuery("s")
    s: S,

    @httpQuery("time")
    time: Time,

    @httpQuery("ts")
    @default(true)
    ts: Ts,

    @httpQuery("v")
    @default(false)
    v: V,
}


@input
structure CatHealth_Input with [CatHealth_QueryParams] {
}

// TODO: Fill in Output Structure
structure CatHealth_Output {}
