// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure DeletePit_QueryParams {
    pit_id: PitIds
}

@input
structure DeletePit_Input with [DeletePit_QueryParams] {
}

@output
structure DeletePit_Output {
    pits: PitInfoList
}
