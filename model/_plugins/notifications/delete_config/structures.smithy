//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure NotificationsConfigs_Delete_WithPathParams_Input {
    @required
    @httpLabel
    config_id: String
}

@input
structure NotificationsConfigs_Delete_WithQueryParams_Input {
    @httpQuery("config_id")
    @documentation("A channel ID.")
    config_id: String,

    @httpQuery("config_id_list")
    @documentation("A comma-separated list of channel IDs.")
    config_id_list: String
}

structure NotificationsConfigs_Delete_Output {
    delete_response_list: DeleteResponseList
}

map DeleteResponseList {
    key: String
    value: RestStatus
}

enum RestStatus {
    CONTINUE = "continue",
    SWITCHING_PROTOCOLS = "switching_protocols",
    OK = "ok",
    CREATED = "created",
    ACCEPTED = "accepted",
    NON_AUTHORITATIVE_INFORMATION = "non_authoritative_information",
    NO_CONTENT = "no_content",
    RESET_CONTENT = "reset_content",
    PARTIAL_CONTENT = "partial_content",
    MULTI_STATUS = "multi_status",
    MULTIPLE_CHOICES = "multiple_choices",
    MOVED_PERMANENTLY = "moved_permanently",
    FOUND = "found",
    SEE_OTHER = "see_other",
    NOT_MODIFIED = "not_modified",
    USE_PROXY = "use_proxy",
    TEMPORARY_REDIRECT = "temporary_redirect"
}
