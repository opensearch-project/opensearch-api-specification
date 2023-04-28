// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterAllocationExplain_QueryParams {
    @httpQuery("include_yes_decisions")
    @default(false)
    include_yes_decisions: IncludeYesDecisions,

    @httpQuery("include_disk_info")
    @default(false)
    include_disk_info: IncludeDiskInfo,
}

// TODO: Fill in Body Parameters
structure ClusterAllocationExplain_BodyParams {}

@input
structure ClusterAllocationExplain_Get_Input with [ClusterAllocationExplain_QueryParams] {
}

@input
structure ClusterAllocationExplain_Post_Input with [ClusterAllocationExplain_QueryParams] {
    @httpPayload
    content: ClusterAllocationExplain_BodyParams,
}

// TODO: Fill in Output Structure
structure ClusterAllocationExplain_Output {}
