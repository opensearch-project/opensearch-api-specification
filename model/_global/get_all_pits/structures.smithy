// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure PitDetail{
    pitId: String,
    creation_time: Long,
    keep_alive: Long
}

list ListPitDetail{
    member: PitDetail
}

@input
structure GetAllPits_Input {
}

@output
structure GetAllPits_Output {
    pits: ListPitDetail
}
