//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure NotificationsConfigs_Get_Input {
    config_id_list: ConfigIdList,
    sort_field: String,
    sort_order: String,
    from_index: Integer,
    max_items: Integer,

    @httpQuery("last_updated_time_ms")
    lastUpdatedTimeMs: Long,

    @httpQuery("created_time_ms")
    createdTimeMs: Long,

    @httpQuery("config_type")
    configType: NotificationConfigType,

    @httpQuery("email.email_account_id")
    emailAccountId: String,

    @httpQuery("email.email_group_id_list")
    emailGroupIdList: String,

    @httpQuery("smtp_account.method")
    smtpAccountMethod: String,

    @httpQuery("ses_account.region")
    sesAccountRegion: String,

    @httpQuery("name")
    name: String,

    @httpQuery("name.keyword")
    nameKeyword: String,

    @httpQuery("description")
    description: String,

    @httpQuery("description.keyword")
    descriptionKeyword: String,

    @httpQuery("slack.url")
    slackUrl: String,

    @httpQuery("slack.url.keyword")
    slackUrlKeyword: String,

    @httpQuery("chime.url")
    chimeUrl: String,

    @httpQuery("chime.url.keyword")
    chimeUrlKeyword: String,

    @httpQuery("microsoft_teams.url")
    microsoftTeamsUrl: String,

    @httpQuery("microsoft_teams.url.keyword")
    microsoftTeamsUrlKeyword: String,

    @httpQuery("webhook.url")
    webhookUrl: String,

    @httpQuery("webhook.url.keyword")
    webhookUrlKeyword: String,

    @httpQuery("smtp_account.host")
    smtpAccountHost: String,

    @httpQuery("smtp_account.host.keyword")
    smtpAccountHostKeyword: String,

    @httpQuery("smtp_account.from_address")
    smtpAccountFromAddress: String,

    @httpQuery("smtp_account.from_address.keyword")
    smtpAccountFromAddressKeyword: String,

    @httpQuery("sns.topic_arn")
    snsTopicArn: String,

    @httpQuery("sns.topic_arn.keyword")
    snsTopicArnKeyword: String,

    @httpQuery("sns.role_arn")
    snsRoleArn: String,

    @httpQuery("sns.role_arn.keyword")
    snsRoleArnKeyword: String,

    @httpQuery("ses_account.role_arn")
    sesAccountRoleArn: String,

    @httpQuery("ses_account.role_arn.keyword")
    sesAccountRoleArnKeyword: String,

    @httpQuery("ses_account.from_address")
    sesAccountFromAddress: String,

    @httpQuery("ses_account.from_address.keyword")
    sesAccountFromAddressKeyword: String,

    @httpQuery("is_enabled")
    isEnabled: Boolean,

    @httpQuery("email.recipient_list.recipient")
    emailRecipientListRecipient: String,

    @httpQuery("email.recipient_list.recipient.keyword")
    emailRecipientListRecipientKeyword: String,

    @httpQuery("email_group.recipient_list.recipient")
    emailGroupRecipientListRecipient: String,

    @httpQuery("email_group.recipient_list.recipient.keyword")
    emailGroupRecipientListRecipientKeyword: String,

    @httpQuery("query")
    query: String,

    @httpQuery("text_query")
    textQuery: String
}

list ConfigIdList {
    member: String
}

@input
structure NotificationsConfigsItem_Get_Input {
    @required
    @httpLabel
    config_id: String
}

enum TotalHitRelation {
    EQ = "eq",
    GTE = "gte"
}

structure NotificationsConfigs_Get_Output {
    start_index: Long,
    total_hits: Long,
    total_hit_relation: TotalHitRelation,
    config_list: NotificationsConfigsList
}

list NotificationsConfigsList {
    member: NotificationsConfigsOutputItem
}

structure NotificationsConfigsOutputItem {
    config_id: String,
    last_updated_time_ms: Long,
    created_time_ms: Long,
    config: NotificationsConfigItem
}
