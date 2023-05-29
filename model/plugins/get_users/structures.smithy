// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch


@input
structure GetAllUsers_Input {}

@output
structure GetAllUsers_Output {
    content: UserList
}

@input
structure GetUser_Input{
    @required
    @httpLabel
    username: String
}

@output
structure GetUser_Output {
    user: User
}
