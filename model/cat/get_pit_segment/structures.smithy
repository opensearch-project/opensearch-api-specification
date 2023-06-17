// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure GetPitSegment_BodyParams {
    @required
    pit_id: PitIds
}

list PitIds{
    member: String
}

@input
structure GetPitSegment_Input{
    @httpPayload
    pit_id: GetPitSegment_BodyParams
}

@output
structure GetPitSegment_Output {
    content: PitSegment
}
