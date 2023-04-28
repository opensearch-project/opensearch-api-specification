// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Ping_QueryParams {
}


@input
structure Ping_Input with [Ping_QueryParams] {
}

// TODO: Fill in Output Structure
structure Ping_Output {}
