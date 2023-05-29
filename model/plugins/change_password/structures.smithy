// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure ChangePassword_Input{
    current_password: CurrentPassword
    password: NewPassword
}

@output
structure ChangePassword_Output{
    status: ChangeStatus
    message: Message
}
