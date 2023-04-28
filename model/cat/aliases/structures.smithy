// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatAliases_QueryParams {
    @httpQuery("format")
    format: Format,

    @httpQuery("local")
    @default(false)
    local: Local,

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

    @httpQuery("expand_wildcards")
    @default("all")
    expand_wildcards: ExpandWildcards,
}


@input
structure CatAliases_Input with [CatAliases_QueryParams] {
}

@input
structure CatAliases_WithName_Input with [CatAliases_QueryParams] {
    @required
    @httpLabel
    name: PathAliasNames,
}

// TODO: Fill in Output Structure
structure CatAliases_Output {}
