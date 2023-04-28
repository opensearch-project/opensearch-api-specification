// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClearScroll_QueryParams {
}


@input
structure ClearScroll_Input with [ClearScroll_QueryParams] {
}

@input
structure ClearScroll_WithScrollId_Input with [ClearScroll_QueryParams] {
    @required
    @httpLabel
    scroll_id: PathScrollIds,
}

// TODO: Fill in Output Structure
structure ClearScroll_Output {}
