//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#get-action-groups"
)

@xOperationGroup("security.get_action_groups")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_security/api/actiongroups/")
@documentation("Retrieves all action groups.")
operation GetActionGroups {
    input: GetActionGroups_Input,
    output: GetActionGroups_Output
}
