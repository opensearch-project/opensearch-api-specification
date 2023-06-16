// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch


@input
structure DeleteRoleMapping_Input{
    @required
    @httpLabel
    role: String
}

@output
structure DeleteRoleMapping_Output {
    status: MessageStatus,
    message: Message
}
