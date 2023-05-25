// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch


@input
structure GetAllPitSegments_Input {
}

@output
structure GetAllPitSegments_Output {
    @documentation("Information about the active point-in-time segments.")
    content: PitSegments
}

@input
structure GetPitSegments_Input{
    pit_id: PitIds
}

@output
structure GetPitSegments_Output {
    @documentation("Information about segments for one or several PITs.")
    content: PitSegments
}
