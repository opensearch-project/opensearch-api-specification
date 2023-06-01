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
structure PatchRole_Input{
    @required
    @httpLabel
    role: String

    role_patch: PatchOperationList
}

@output
structure PatchRole_Output {
    content: Response
}

@input
structure PatchRoles_Input {
    role_patch: PatchOperationList
}

@output
structure PatchRoles_Output {
    content: Response
}
