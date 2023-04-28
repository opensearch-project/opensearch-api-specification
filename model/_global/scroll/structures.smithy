// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Scroll_QueryParams {
    @httpQuery("scroll")
    scroll: Scroll,

    @httpQuery("scroll_id")
    scroll_id: ScrollId,

    @httpQuery("rest_total_hits_as_int")
    @default(false)
    rest_total_hits_as_int: RestTotalHitsAsInt,
}

// TODO: Fill in Body Parameters
structure Scroll_BodyParams {}

@input
structure Scroll_Get_Input with [Scroll_QueryParams] {
}

@input
structure Scroll_Post_Input with [Scroll_QueryParams] {
    @httpPayload
    content: Scroll_BodyParams,
}

@input
structure Scroll_Get_WithScrollId_Input with [Scroll_QueryParams] {
    @required
    @httpLabel
    scroll_id: PathScrollId,
}

@input
structure Scroll_Post_WithScrollId_Input with [Scroll_QueryParams] {
    @required
    @httpLabel
    scroll_id: PathScrollId,
    @httpPayload
    content: Scroll_BodyParams,
}

// TODO: Fill in Output Structure
structure Scroll_Output {}
