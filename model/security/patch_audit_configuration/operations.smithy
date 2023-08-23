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

@xOperationGroup("security.patch_audit_configuration")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PATCH", uri: "/_plugins/_security/api/audit")
@documentation("A PATCH call is used to update specified fields in the audit configuration.")
operation PatchAuditConfiguration {
    input: PatchAuditConfiguration_Input,
    output: PatchAuditConfiguration_Output
}
