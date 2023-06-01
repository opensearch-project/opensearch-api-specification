// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure PatchOperation {
    op: String,
    path: String,
    value: AttributeMap
}

list PatchOperationList{
    member: PatchOperation
}

@input
structure PatchUser_Input {
    @required
    @httpLabel
    username: String

    @required
    @httpPayload
    userPatch: PatchOperationList
}

@output
structure PatchUser_Output {
    content: Response
}

@input
structure PatchUsers_Input{
    @required
    @httpPayload
    userPatches: PatchOperationList
}

@output
structure PatchUsers_Output {
    content: Response
}
