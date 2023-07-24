// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure GetAuditConfig_Input{
}

@output
structure GetAuditConfig_Output {
    @httpPayload
    content: AuditConfigWithReadOnly
}

structure AuditConfigWithReadOnly {
    _readonly: AuditConfigReadOnlyList,
    config: AuditConfig
}

list AuditConfigReadOnlyList {
    member: String
}
