// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure Role{
    reserved: Boolean
    hidden: Boolean
    description: String
    cluster_permission: ClusterPermission
    index_permission: IndexPermission
    tenant_permissions: TenantPermission
    static: Boolean
}

list ClusterPermission {
    member: String
}

structure IndexPermission {
    index_patterns: IndexPatterns
    fls: Fls
    masked_fields: MaskedFields
    allowed_actions: AllowedActions
}

list RolesList{
    member: Role
}

list TenantPermission {
    member: String
}

list IndexPatterns{
    member: String
}

list Fls{
    member: String
}

list MaskedFields{
    member: String
}

list AllowedActions{
    member: String
}

structure PatchRoleParams{
    rolePatch: PatchOperation
}

structure PatchRolesParams{
    rolesPatch: PatchOperationList
}
