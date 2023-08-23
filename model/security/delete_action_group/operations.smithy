//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#delete-action-group"
)

@xOperationGroup("security.delete_action_group")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "DELETE", uri: "/_plugins/_security/api/actiongroups/{action_group}")
@documentation("Delete a specified action group.")
operation DeleteActionGroup {
    input: DeleteActionGroup_Input,
    output: DeleteActionGroup_Output
}
