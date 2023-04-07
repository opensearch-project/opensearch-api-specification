// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure GetSource_QueryParams {
    @httpQuery("preference")
    @default("random")
    query_preference: Preference,

    @httpQuery("realtime")
    query_realtime: Realtime,

    @httpQuery("refresh")
    @documentation("Refresh the shard containing the document before performing the operation.")
    query_refresh: RefreshBoolean,

    @httpQuery("routing")
    query_routing: Routing,

    @httpQuery("_source")
    query__source: Source,

    @httpQuery("_source_excludes")
    query__source_excludes: SourceExcludes,

    @httpQuery("_source_includes")
    query__source_includes: SourceIncludes,

    @httpQuery("version")
    query_version: Version,

    @httpQuery("version_type")
    query_version_type: VersionType,
}


@input
structure GetSource_Input with [GetSource_QueryParams] {
    @required
    @httpLabel
    id: PathDocumentId,

    @required
    @httpLabel
    index: PathIndex,
}

// TODO: Fill in Output Structure
structure GetSource_Output {}
