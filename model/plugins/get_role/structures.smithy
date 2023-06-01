// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch


@input
structure GetRole_Input{
    @required
    @httpLabel
    role: String
}

list RolesList{
    member: Role
}

@output
structure GetRole_Output {
    content: Role
}

@input
structure GetAllRoles_Input {}

@output
structure GetAllRoles_Output {
    content: RolesList
}
