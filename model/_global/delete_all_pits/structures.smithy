// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure PitsDetailsDeleteAll{
    successful: Boolean,
    pit_id: String
}

list PitsDeleteAll{
    member: PitsDetailsDeleteAll
}

@mixin
structure DeleteAllPits_QueryParams {}

@input
structure DeleteAllPits_Input with [DeleteAllPits_QueryParams] {
}

@output
structure DeleteAllPits_Output {
    pits: PitsDeleteAll
}
