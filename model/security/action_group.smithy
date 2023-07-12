// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure CreateActionGroupParams{
    allowed_actions: AllowedActions
}

list AllowedActions {
    member: String
}

list ActionGroupsList{
    member: Action_Group
}

list test{
    member:String
}

structure Action_Group{
    reserved: Boolean,
    hidden: Boolean,
    allowed_actions: AllowedActions,
    type: String,
    description: String,
    static: Boolean
}

map ActionGroupsMap {
     key: String,
     value: Tenant
 }
