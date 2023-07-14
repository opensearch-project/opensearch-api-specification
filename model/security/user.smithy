// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure User {
    hash: String,
    reserved: Boolean,
    hidden: Boolean,
    backend_roles: BackendRolesList,
    attributes: AttributesMap,
    description: String,
    opendistro_security_roles: OpendistroSecurityRolesList,
    static: Boolean
}

list BackendRolesList {
    member: String
}

map AttributesMap {
    key: String,
    value: String
}

list OpendistroSecurityRolesList {
    member: String
}

map UsersMap {
    key: String,
    value: User
}
