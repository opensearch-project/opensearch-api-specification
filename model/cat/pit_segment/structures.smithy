// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure PitSegment_BodyParams {
    @required
    pit_id: PitIds
}

list PitIds{
    member: String
}

@input
structure PitSegment_Input{
    @httpPayload
    pit_id: PitSegment_BodyParams
}

@output
structure PitSegment_Output {
    content: PitSegmentTable
}
