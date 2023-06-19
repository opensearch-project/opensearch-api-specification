// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure PitSegments_BodyParams {
    @required
    pit_id: PitIds
}

list PitIds{
    member: String
}

@input
structure PitSegments_Input{
    @httpPayload
    pit_id: PitSegments_BodyParams
}

@output
structure PitSegments_Output {
    content: PitSegment
}
