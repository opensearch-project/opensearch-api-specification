// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure CatPitSegments_BodyParams {
    @required
    pit_id: PitIds
}

list PitIds{
    member: String
}

@input
structure CatPitSegments_Input{
    @httpPayload
    pit_id: CatPitSegments_BodyParams
}

@output
structure CatPitSegments_Output {
    content: CatPitSegment
}
