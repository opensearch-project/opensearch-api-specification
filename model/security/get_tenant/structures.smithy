//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure GetTenants_Input {}

@output
structure GetTenants_Output {
    tenantlist: TenantList
}

@input
structure GetTenant_Input{
    @required
    @httpLabel
    tenant: String
}

@output
structure GetTenant_Output {
    tenant: Tenant
}

structure Tenant{
    reserved: Boolean,
    hidden: Boolean,
    description: String,
    static: Boolean
}

list TenantList{
    member: Tenant
}
