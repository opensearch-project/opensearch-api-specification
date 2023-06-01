//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

list ActionGroupsList{
    member: Action_Group
}

structure Action_Group{
    reserved: Boolean,
    hidden: Boolean,
    allowed_actions: AllowedActions,
    type: String,
    description: String,
    static: Boolean
}

@input
structure GetActionGroups_Input {}

@output
structure GetActionGroups_Output {
    content: ActionGroupsList
}

@input
structure GetActionGroup_Input{
    @required
    @httpLabel
    action_group: String
}

@output
structure GetActionGroup_Output {
    action_group: Action_Group
}
