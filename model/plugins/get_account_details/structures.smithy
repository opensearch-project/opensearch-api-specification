// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure GetUser_Output {
    user_name: String,
    is_reserved: Boolean,
    is_hidden: Boolean,
    is_internal_user: Boolean,
    user_requested_tenant: String,
    backend_roles: BackendRolesList,
    custom_attribute_names: CustomAttributeNamesList,
    tenants: UserTenants,
    roles: UserRolesList
}

list BackendRolesList {
    member: String
}

list CustomAttributeNamesList {
    member: String
}

structure UserTenants {
    global_tenant: Boolean,
    admin_tenant: Boolean,
    admin: Boolean
}

list UserRolesList {
    member: String
}

@input
structure GetAccountDetails_Input{}

@output
structure GetAccountDetails_Output {
    content: GetUser_Output
}
