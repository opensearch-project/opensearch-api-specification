// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

list UserList {
    member: User
}

structure User {
    hash: String,
    reserved: Boolean,
    hidden: Boolean,
    backend_roles: BackendRolesList,
    attributes: AttributeMap,
    description: String,
    opendistro_security_roles: OpendistroSecurityRolesList,
    static: Boolean
}

list BackendRolesList {
    member: String
}

list OpendistroSecurityRolesList {
    member: String
}

structure PatchUserParams{
    userPatch: PatchOperation
}

structure PatchUsersParams{
    usersPatch: PatchOperationList
}
