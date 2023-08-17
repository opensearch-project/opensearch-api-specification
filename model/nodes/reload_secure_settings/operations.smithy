// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/nodes-apis/nodes-reload-secure/"
)

@xOperationGroup("nodes.reload_secure_settings")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_nodes/reload_secure_settings")
@documentation("Reloads secure settings.")
operation NodesReloadSecureSettings {
    input: NodesReloadSecureSettings_Input,
    output: NodesReloadSecureSettings_Output
}

@xOperationGroup("nodes.reload_secure_settings")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_nodes/{node_id}/reload_secure_settings")
@documentation("Reloads secure settings.")
operation NodesReloadSecureSettings_WithNodeId {
    input: NodesReloadSecureSettings_WithNodeId_Input,
    output: NodesReloadSecureSettings_Output
}
