// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure NodesStats_QueryParams {
    @httpQuery("completion_fields")
    completion_fields: CompletionFields,

    @httpQuery("fielddata_fields")
    fielddata_fields: FielddataFields,

    @httpQuery("fields")
    @documentation("Comma-separated list of fields for `fielddata` and `completion` index metric (supports wildcards).")
    fields: Fields,

    @httpQuery("groups")
    groups: Groups,

    @httpQuery("level")
    @default("node")
    level: NodesStatLevel,

    @httpQuery("types")
    types: Types,

    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("include_segment_file_sizes")
    @default(false)
    include_segment_file_sizes: IncludeSegmentFileSizes,
}


@input
structure NodesStats_Input with [NodesStats_QueryParams] {
}

@input
structure NodesStats_WithMetric_Input with [NodesStats_QueryParams] {
    @required
    @httpLabel
    metric: PathNodesStatsMetric,
}

@input
structure NodesStats_WithNodeId_Input with [NodesStats_QueryParams] {
    @required
    @httpLabel
    node_id: PathNodeId,
}

@input
structure NodesStats_WithIndexMetricMetric_Input with [NodesStats_QueryParams] {
    @required
    @httpLabel
    metric: PathNodesStatsMetric,

    @required
    @httpLabel
    index_metric: PathIndexMetric,
}

@input
structure NodesStats_WithMetricNodeId_Input with [NodesStats_QueryParams] {
    @required
    @httpLabel
    metric: PathNodesStatsMetric,

    @required
    @httpLabel
    node_id: PathNodeId,
}

@input
structure NodesStats_WithIndexMetricMetricNodeId_Input with [NodesStats_QueryParams] {
    @required
    @httpLabel
    metric: PathNodesStatsMetric,

    @required
    @httpLabel
    index_metric: PathIndexMetric,

    @required
    @httpLabel
    node_id: PathNodeId,
}

// TODO: Fill in Output Structure
structure NodesStats_Output {}
