// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesSimulateTemplate_QueryParams {
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
@documentation("New index template definition to be simulated, if no index template name is specified")
structure IndicesSimulateTemplate_BodyParams {}

@input
structure IndicesSimulateTemplate_Input with [IndicesSimulateTemplate_QueryParams] {
    @httpPayload
    content: IndicesSimulateTemplate_BodyParams,
}

@input
structure IndicesSimulateTemplate_WithName_Input with [IndicesSimulateTemplate_QueryParams] {
    @required
    @httpLabel
    name: PathTemplateName,
    @httpPayload
    content: IndicesSimulateTemplate_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesSimulateTemplate_Output {}
