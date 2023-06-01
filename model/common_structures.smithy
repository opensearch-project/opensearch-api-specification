// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

map UserDefinedValueMap{
    key: String,
    value: UserDefinedValue
}

document UserDefinedValue

list UserDefinedValueList{
    member: String
}

list UserDefinedObjectList{
    member: Document
}

structure ShardStatistics{
    total: Integer,
    successful: Integer,
    skipped: Integer,
    failed: Integer
}

structure HitsMetadata{
    total: Total,
    max_score: Double,
    hits: ListHits
}

structure Total{
    value: Integer,
    relation: Relation,
}

list ListHits{
    member: Hits
}

enum Relation {
    @documentation("Accurate")
    EQ = "eq"
    @documentation("Lower bound, including returned documents")
    GTE = "gte"
}

structure Hits{
    _index: String,
    _type: String,
    _id: String,
    _score: Float,
    _source: Document,
    fields: Document
}

structure Config{
    compliance: Compliance
    enabled: Boolean
    audit: AuditLogs
}

structure AuditLogs{
    ignore_users: IgnoreUsersList
    ignore_requests: IgnoreRequests
    disabled_rest_categories: DisabledRestCategories
    disabled_transport_categories: DisabledTransportCategories
    log_request_body: Boolean
    resolve_indices: Boolean
    resolve_bulk_requests: Boolean
    exclude_sensitive_headers: Boolean
    enable_transport: Boolean
    enable_rest: Boolean
}

structure Compliance{
    enabled: Boolean
    write_log_diffs: Boolean
    read_watched_fields: AttributeMap
    read_ignore_users: IgnoreUsersList
    write_watched_indices: WriteWatchedIndices
    write_ignore_users: WriteIgnoreUsers
    read_metadata_only: Boolean
    write_metadata_only: Boolean
    external_config: Boolean
    internal_config: Boolean
}

map AttributeMap {
    key: String,
    value: String
}

structure Response{
    status: String
    message: String
}
