// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure NodesReloadSecureSettings_QueryParams {
    @httpQuery("timeout")
    timeout: Timeout,
}

// TODO: Fill in Body Parameters
@documentation("An object containing the password for the opensearch keystore")
structure NodesReloadSecureSettings_BodyParams {}

@input
structure NodesReloadSecureSettings_Input with [NodesReloadSecureSettings_QueryParams] {
    @httpPayload
    content: NodesReloadSecureSettings_BodyParams,
}

@input
structure NodesReloadSecureSettings_WithNodeId_Input with [NodesReloadSecureSettings_QueryParams] {
    @required
    @httpLabel
    @documentation("Comma-separated list of node IDs to span the reload/reinit call. Should stay empty because reloading usually involves all cluster nodes.")
    node_id: PathNodeId,
    @httpPayload
    content: NodesReloadSecureSettings_BodyParams,
}

// TODO: Fill in Output Structure
structure NodesReloadSecureSettings_Output {}
