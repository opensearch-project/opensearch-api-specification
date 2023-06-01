// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure PitSegments {
    index: Index,

    shard: ShardNumber,

    prirep: Pri,

    ip: IpAddress,

    segment: SegmentId,

    generation: GenerationNumber,

    docs_count: DocsCount,

    docs_deleted: DocsDeleted,

    size: SizeSegment,

    size_memory: Size,

    committed: Boolean,

    searchable: Boolean,

    version: VersionString,

    compound: Boolean,
}

@input
structure GetAllPitSegments_Input {
}

@output
structure GetAllPitSegments_Output {
    content: PitSegments
}

@input
structure GetPitSegments_Input{
    @required
    @httpPayload
    pit_id: PitIds
}

@output
structure GetPitSegments_Output {
    content: PitSegments
}
