// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure RoleMapping{
    hosts: Hosts
    users: Users
    reserved: Boolean
    hidden: Boolean
    backend_roles: BackendRoles
    and_backend_roles: AndBackendRoles
    description: String
}

list Hosts{
    member: String
}

list Users{
    member: String
}

list BackendRoles{
    member: String
}

list AndBackendRoles{
    member: String
}

map RoleMappings {
    key: String,
    value: RoleMapping
}
