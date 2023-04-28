// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatHelp_QueryParams {
    @httpQuery("help")
    @default(false)
    help: Help,

    @httpQuery("s")
    s: S,
}


@input
structure CatHelp_Input with [CatHelp_QueryParams] {
}

// TODO: Fill in Output Structure
structure CatHelp_Output {}
