// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

list PitInfoList {
    member: PitInfo
}

structure PitInfo {
    successful: Boolean,
    pit_id: String
}

list PitIds{
    member: String
}


structure DeletePit_BodyParams {
    @required
    pit_id: PitIds
}

@input
structure DeletePit_Input {
    @httpPayload
    content: DeletePit_BodyParams
}

@output
structure DeletePit_Output {
    pits: PitInfoList
}
