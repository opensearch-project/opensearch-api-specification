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
structure PutAudit_Input{
    @required
    @httpPayload
    content: AuditConfig
}

@output
structure PutAudit_Output {
    content: Response
}
