// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

map RolesMap {
    key: String
    value: Role
}

structure Role {
    reserved: Boolean
    hidden: Boolean
    description: String
    cluster_permissions: ClusterPermission
    index_permissions: IndexPermissionList
    tenant_permissions: TenantPermissionList
    static: Boolean
}

list ClusterPermission {
    member: String
}

structure IndexPermission {
    index_patterns: IndexPatterns
    dls: String
    fls: Fls
    masked_fields: MaskedFields
    allowed_actions: AllowedActions
}

list IndexPermissionList {
    member: IndexPermission
}

structure TenantPermission {
    tenant_patterns: TenantPatterns
    allowed_actions: AllowedActions
}

list TenantPermissionList {
    member: TenantPermission
}

list TenantPatterns {
    member: String
}

list IndexPatterns {
    member: String
}

list Fls {
    member: String
}

list MaskedFields {
    member: String
}

list AllowedActions {
    member: String
}
