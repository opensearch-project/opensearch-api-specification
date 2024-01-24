//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure NotificationsFeatures_Get_Input {
}

@output
structure NotificationsFeatures_Get_Output {
    allowed_config_type_list: NotificationsFeaturesList,
    plugin_features: NotificationsPluginFeatures
}

list NotificationsFeaturesList {
    member: NotificationsFeaturesListItem
}

@documentation("Limit the information for notifications features list.")
enum NotificationsFeaturesListItem {
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

structure NotificationsPluginFeatures {
    tooltip_support: Boolean
}
