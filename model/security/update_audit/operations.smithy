// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#audit-logs"
)

@vendorExtensions(
    "x-operation-group": "security.update_audit",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_opendistro/_security/api/audit/config")
@documentation("A PUT call updates the audit configuration.")
operation UpdateAudit {
    input: UpdateAudit_Input,
    output: UpdateAudit_Output
}
