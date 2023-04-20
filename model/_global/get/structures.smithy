// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Get_QueryParams {
    @httpQuery("stored_fields")
    stored_fields: StoredFields,

    @httpQuery("preference")
    @default("random")
    preference: Preference,

    @httpQuery("realtime")
    realtime: Realtime,

    @httpQuery("refresh")
    @documentation("Refresh the shard containing the document before performing the operation.")
    refresh: RefreshBoolean,

    @httpQuery("routing")
    routing: Routing,

    @httpQuery("_source")
    _source: Source,

    @httpQuery("_source_excludes")
    _source_excludes: SourceExcludes,

    @httpQuery("_source_includes")
    _source_includes: SourceIncludes,

    @httpQuery("version")
    version: Version,

    @httpQuery("version_type")
    version_type: VersionType,
}


@input
structure Get_Input with [Get_QueryParams] {
    @required
    @httpLabel
    id: PathDocumentId,

    @required
    @httpLabel
    index: PathIndex,
}

structure Get_Output {

    @required
    _index: IndexName,

    _type: String,

    @required
    _id: String,

    version: Integer,

    seq_no: Long,

    primary_term: Long,

    @required
    found: Boolean,

    _routing: String,

    _source: UserDefinedValueMap,

    _fields: UserDefinedValueMap
}
