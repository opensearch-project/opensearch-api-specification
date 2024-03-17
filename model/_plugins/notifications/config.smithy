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

@documentation("Type of notification configuration.")
enum NotificationConfigType {
    SLACK = "slack",
    CHIME = "chime",
    MICROSOFT_TEAMS = "microsoft_teams",
    WEBHOOK = "webhook",
    EMAIL = "email",
    SNS = "sns",
    SES_ACCOUNT = "ses_account",
    SMTP_ACCOUNT = "smtp_account",
    EMAIL_GROUP = "email_group"
}

structure NotificationsConfigItem {
    @required
    name: String,
    description: String
    @required
    config_type: NotificationConfigType,
    is_enabled: Boolean,
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

@xDataType("array")
@xEnumOptions(["POST", "PUT", "PATCH"])
@documentation("The HTTP method used to send the webhook.")
string HttpMethodType

map HeaderParamsMap {
    key: String
    value: Integer
}

structure Webhook {
    @required
    url: String,
    method: HttpMethodType,
    header_params: HeaderParamsMap,
}

@xDataType("array")
@xEnumOptions(["ssl", "start_tls", "none"])
@documentation("The email encryption method.")
string EmailEncryptionMethod

structure SmtpAccount {
    @required
    host: String,
    @required
    port: Integer,
    @required
    method: EmailEncryptionMethod,
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

list EmailGroupIdList {
    member: String
}

list RecipientList {
    member: RecipientListItem
}

structure RecipientListItem {
    recipient: String
}

structure EmailGroup {
    @required
    recipient_list: RecipientList,
    email_group_id_list: EmailGroupIdList
}

structure Email {
    @required
    email_account_id: String,
    recipient_list: RecipientList
}
