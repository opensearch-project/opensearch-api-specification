// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

list Actions {
    member: String
}

@documentation("Comma-separated list of fields for `fielddata` and `suggest` index metric (supports wildcards).")
list CompletionFields {
    member: String
}

@documentation("Comma-separated list of fields to return as the docvalue representation of a field for each hit.")
list DocvalueFields {
    member: String
}

@documentation("Comma-separated list of fields for `fielddata` index metric (supports wildcards).")
list FielddataFields {
    member: String
}

list Fields {
    member: String
}

@documentation("Comma-separated list of search groups for `search` index metric.")
list Groups {
    member: String
}

@documentation("Comma-separated list of column names to display.")
list H {
    member: String
}

@documentation("Comma-separated list of documents ids. You must define ids as parameter or set 'ids' or 'docs' in the request body.")
list Ids {
    member: String
}

list IndexNames {
    member: String
}

@documentation("Comma-separated list of indices; use `_all` or empty string to perform the operation on all indices.")
list Indices {
    member: String
}

@documentation("Comma-separated list of node IDs or names to limit the returned information; use `_local` to return information from the node you're connecting to, leave empty to get information from all nodes.")
list Nodes {
    member: String
}

@documentation("Comma-separated list of specific routing values.")
list Routings {
    member: String
}

@documentation("Comma-separated list of column names or column aliases to sort by.")
list S {
    member: String
}

@documentation("Comma-separated list of shards to display.")
list Shards {
    member: String
}

@documentation("Comma-separated list of <field>:<direction> pairs.")
list Sort {
    member: String
}

@documentation("True or false to return the _source field or not, or a list of fields to return.")
list Source {
    member: String
}

@documentation("List of fields to exclude from the returned _source field.")
list SourceExcludes {
    member: String
}

@documentation("List of fields to extract and return from the _source field.")
list SourceIncludes {
    member: String
}

@documentation("Specific 'tag' of the request for logging and statistical purposes.")
list Stats {
    member: String
}

@documentation("Comma-separated list of stored fields to return.")
list StoredFields {
    member: String
}

@documentation("Comma-separated list of document types for the `indexing` index metric.")
list Types {
    member: String
}

list Hosts{
    member: String
}

list Users{
    member: String
}

list BackendRoles{
    member: String
}

list AndBackendRoles{
    member: String
}
list RolesMappingList{
    member: RoleMapping
}

list PatchOperationList{
    member: PatchOperation
}
