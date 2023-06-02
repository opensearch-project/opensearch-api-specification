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

list UserList {
    member: User
}

structure User {
    hash: String,
    reserved: Boolean,
    hidden: Boolean,
    backend_roles: BackendRolesList,
    attributes: AttributeMap,
    description: String,
    opendistro_security_roles: OpendistroSecurityRolesList,
    static: Boolean
}

map AttributeMap {
    key: String,
    value: String
}

structure GeneralResponse{
    status: String,
    message: String
}
