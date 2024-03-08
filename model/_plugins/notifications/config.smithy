//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure NotificationsConfig {
    config_id: String,
    @required
    config: NotificationsConfigItem
}

structure NotificationsConfigItem {
    @required
    name: String,
    description: String,
    @required
    config_type: String,
    is_enabled: Boolean,
    details: NotificationConfigDetails
}

union NotificationConfigDetails {
    sns: SnsItem,
    slack: SlackItem,
    chime: Chime,
    webhook: Webhook,
    smtp_account: SmtpAccount,
    ses_account: SesAccount,
    email_group: EmailGroup,
    email: Email,
    microsoft_teams: MicrosoftTeamsItem
}

structure MicrosoftTeamsItem {
    @required
    url: String
}

structure SlackItem {
    @required
    url: String
}

structure SnsItem {
    @required
    topic_arn: String,
    role_arn: String
}

structure Chime {
    @required
    url: String
}

structure Webhook {
    @required
    url: String
}

structure SmtpAccount {
    @required
    host: String,
    @required
    port: Integer,
    @required
    method: String,
    @required
    from_addess: String
}

structure SesAccount {
    @required
    region: String,
    role_arn: String,
    @required
    from_addess: String
}

structure EmailGroup {
    @required
    recipient_list: RecipientList
}

structure Email {
    @required
    email_account_id: String,
    recipient_list: RecipientList
}

list RecipientList {
    member: RecipientListItem
}

structure RecipientListItem {
    recipient: String
}