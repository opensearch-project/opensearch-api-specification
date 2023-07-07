// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesSimulateIndexTemplate_QueryParams {
    @httpQuery("create")
    @documentation("Whether the index template we optionally defined in the body should only be dry-run added if new or can also replace an existing one.")
    @default(false)
    create: Create,

    @httpQuery("cause")
    @default("false")
    cause: Cause,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}

// TODO: Fill in Body Parameters
@documentation("New index template definition, which will be included in the simulation, as if it already exists in the system")
structure IndicesSimulateIndexTemplate_BodyParams {}

@input
structure IndicesSimulateIndexTemplate_Input with [IndicesSimulateIndexTemplate_QueryParams] {
    @required
    @httpLabel
    name: PathIndexName,
    @httpPayload
    content: IndicesSimulateIndexTemplate_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesSimulateIndexTemplate_Output {}
