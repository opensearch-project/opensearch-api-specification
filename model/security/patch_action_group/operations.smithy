// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#patch-action-group"
)

@xOperationGroup("security.patch_action_group")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PATCH", uri: "/_plugins/_security/api/actiongroups/{action_group}")
@documentation("Updates individual attributes of an action group.")
operation PatchActionGroup {
    input: PatchActionGroup_Input,
    output: PatchActionGroup_Output
}
