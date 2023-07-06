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
    "x-operation-group": "security.get_audit_config",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_opendistro/_security/api/audit")
@documentation("A GET call retrieves the audit configuration.")
operation GetAuditConfig {
    input: GetAuditConfig_Input,
    output: GetAuditConfig_Output
}
