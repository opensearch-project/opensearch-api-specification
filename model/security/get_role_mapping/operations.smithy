// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#get-role-mapping"
)

@xOperationGroup("security.get_role_mapping")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "GET", uri: "/_plugins/_security/api/rolesmapping/{role}")
@documentation("Retrieves one role mapping.")
operation GetRoleMapping {
    input: GetRoleMapping_Input,
    output: GetRoleMapping_Output
}
