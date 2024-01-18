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

// TODO: Fill in Output Structure (delete_response_list: object)
structure NotificationsConfigs_Delete_Output {
}
