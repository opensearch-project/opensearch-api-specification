// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesStats_QueryParams {
    @httpQuery("completion_fields")
    completion_fields: CompletionFields,

    @httpQuery("fielddata_fields")
    fielddata_fields: FielddataFields,

    @httpQuery("fields")
    @documentation("Comma-separated list of fields for `fielddata` and `completion` index metric (supports wildcards).")
    fields: StatFields,

    @httpQuery("groups")
    groups: Groups,

    @httpQuery("level")
    @default("indices")
    level: IndiciesStatLevel,

    @httpQuery("include_segment_file_sizes")
    @default(false)
    include_segment_file_sizes: IncludeSegmentFileSizes,

    @httpQuery("include_unloaded_segments")
    @default(false)
    include_unloaded_segments: IncludeUnloadedSegments,

    @httpQuery("expand_wildcards")
    @default("open")
    expand_wildcards: ExpandWildcards,

    @httpQuery("forbid_closed_indices")
    @default(true)
    forbid_closed_indices: ForbidClosedIndices,
}


@input
structure IndicesStats_Input with [IndicesStats_QueryParams] {
}

@input
structure IndicesStats_WithIndex_Input with [IndicesStats_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,
}

@input
structure IndicesStats_WithMetric_Input with [IndicesStats_QueryParams] {
    @required
    @httpLabel
    metric: PathIndicesStatsMetric,
}

@input
structure IndicesStats_WithIndexMetric_Input with [IndicesStats_QueryParams] {
    @required
    @httpLabel
    index: PathIndices,

    @required
    @httpLabel
    metric: PathIndicesStatsMetric,
}

// TODO: Fill in Output Structure
structure IndicesStats_Output {}
