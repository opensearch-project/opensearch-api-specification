// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

list DeletedPitList {
    member: DeletedPit
}

structure DeletedPit {
    successful: Boolean,
    pit_id: String
}

list PitIds{
    member: String
}


@documentation("The point-in-time ids to be deleted")
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
    pits: DeletedPitList
}
