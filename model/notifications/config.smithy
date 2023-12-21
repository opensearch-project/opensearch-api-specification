//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure NotificationsConfig {
    config_id: String,
    name: String,
    config: NotificationsConfigItem
}

structure NotificationsConfigItem {
    name: String,
    description: String,
    config_type: String,
    is_enabled: Boolean,
    slack: SlackItem
}

structure SlackItem {
    url: String
}

structure NotificationsConfigsOutputItem {
    config_id: String,
    last_updated_time_ms: Integer,
    created_time_ms: Integer,
    config: NotificationsConfigItem
}

list NotificationsConfigsList {
    member: NotificationsConfigsOutputItem
}
