// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure AuditConfig{
    enabled: Boolean
    audit: AuditLogs
    compliance: Compliance
}

@input
structure UpdateAudit_Input{
    @required
    @httpPayload
    content: AuditConfig
}

@output
structure UpdateAudit_Output {
    status: MessageStatus,
    message: Message
}
