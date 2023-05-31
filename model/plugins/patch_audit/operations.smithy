// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/2.7/security/access-control/api/#audit-logs"
)

@vendorExtensions(
    "x-operation-group": "patch_audit",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PATCH", uri: "/_opendistro/_security/api/audit")
@documentation("A PATCH call is used to update specified fields in the audit configuration.")
operation PatchAudit {
    input: PatchAudit_Input,
    output: PatchAudit_Output
}
