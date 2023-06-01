// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

list AllowedActions {
    member: String
}

structure CreateActionGroupParams{
    allowed_actions: AllowedActions
}

@input
structure CreateActionGroup_Input {
    @required
    @httpLabel
    action_group: String
    @httpPayload
    content: CreateActionGroupParams
}

@output
structure CreateActionGroup_Output {
    status: MessageStatus,
    message: Message
}
