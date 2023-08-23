// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#patch-action-groups"
)

@xOperationGroup("security.patch_action_groups")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PATCH", uri: "/_plugins/_security/api/actiongroups")
@documentation("Creates, updates, or deletes multiple action groups in a single call.")
operation PatchActionGroups {
    input: PatchActionGroups_Input,
    output: PatchActionGroups_Output
}
