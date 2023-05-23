// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure CatFielddata_QueryParams {
    @httpQuery("format")
    format: Format,

    @httpQuery("bytes")
    bytes: Bytes,

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

    @httpQuery("fields")
    @documentation("Comma-separated list of fields to return in the output.")
    query_fields: Fields,
}


@input
structure CatFielddata_Input with [CatFielddata_QueryParams] {
}

@input
structure CatFielddata_WithFields_Input with [CatFielddata_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of fields to return the fielddata size.")
    fields: PathFields,
}

// TODO: Fill in Output Structure
structure CatFielddata_Output {}
