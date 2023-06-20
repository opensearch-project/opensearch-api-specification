// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure DeletePit_QueryParams {
}

// TODO: Fill in Body Parameters
@documentation("Comma-separated list of pit IDs to clear")
structure DeletePit_BodyParams {}

@input
structure DeletePit_Input with [DeletePit_QueryParams] {
    @required
    @httpPayload
    content: DeletePit_BodyParams,
}

// TODO: Fill in Output Structure
structure DeletePit_Output {}
