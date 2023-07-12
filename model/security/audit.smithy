// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure AuditConfig {
    compliance: ComplianceConfig
    enabled: Boolean
    audit: AuditLogsConfig
}

structure ComplianceConfig {
    enabled: Boolean
    write_log_diffs: Boolean
    read_watched_fields: AttributesMap
    read_ignore_users: IgnoreUsersList
    write_watched_indices: WriteWatchedIndices
    write_ignore_users: WriteIgnoreUsers
    read_metadata_only: Boolean
    write_metadata_only: Boolean
    external_config: Boolean
    internal_config: Boolean
}

structure AuditLogsConfig {
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

list IgnoreUsersList{
    member: String
}

list IgnoreRequests{
    member: String
}

list DisabledRestCategories{
    member: String
}

list DisabledTransportCategories{
    member: String
}

list WriteWatchedIndices{
    member: String
}

list WriteIgnoreUsers{
    member: String
}
