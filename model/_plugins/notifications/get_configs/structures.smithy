//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure NotificationsConfigs_Get_Input {
}

@input
structure NotificationsConfigsItem_Get_Input {
    @required
    @httpLabel
    config_id: String
}

structure NotificationsConfigs_Get_Output {
    start_index: Integer,
    total_hits: Integer,
    total_hit_relation: String,
    config_list: NotificationsConfigsList
}

list NotificationsConfigsList {
    member: NotificationsConfigsOutputItem
}

structure NotificationsConfigsOutputItem {
    config_id: String,
    last_updated_time_ms: Integer,
    created_time_ms: Integer,
    config: NotificationsConfigItem
}
