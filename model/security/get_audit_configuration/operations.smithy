// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#audit-logs"
)

@xOperationGroup("security.get_audit_configuration")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_security/api/audit")
@documentation("Retrieves the audit configuration.")
operation GetAuditConfiguration {
    input: GetAuditConfiguration_Input,
    output: GetAuditConfiguration_Output
}
