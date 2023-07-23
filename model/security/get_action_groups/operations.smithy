//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#get-action-groups"
)

@vendorExtensions(
    "x-operation-group": "security.get_action_groups",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_security/api/actiongroups/")
@documentation("Lists of all action groups.")
operation GetActionGroups {
    input: GetActionGroups_Input,
    output: GetActionGroups_Output
}
