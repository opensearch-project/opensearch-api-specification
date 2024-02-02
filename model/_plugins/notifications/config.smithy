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

structure SnsItem {
    topic_arn: String,
    role_arn: String
}

structure Chime {
    url: String
}

structure Webhook {
    url: String
}

structure SmtpAccount {
    host: String,
    port: Integer,
    method: String,
    from_addess: String
}

structure SesAccount {
    region: String,
    role_arn: String,
    from_addess: String
}

structure EmailGroup {
    recipient_list: RecipientList,
    role_arn: String,
    from_addess: String
}

list RecipientList {
    member: RecipientListItem
}

structure RecipientListItem {
    recipient: String
}

structure EmailGroupIdListItem {
    recipient: String
}

structure Email {
    email_account_id: String,
    recipient_list: RecipientList
}
