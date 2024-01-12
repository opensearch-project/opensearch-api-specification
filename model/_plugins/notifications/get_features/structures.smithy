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

@xDataType("array")
@xEnumOptions([
    "slack",
    "chime",
    "microsoft_teams",
    "webhook",
    "email",
    "sns",
    "ses_account",
    "smtp_account",
    "email_group"
])
@documentation("Limit the information for notifications features list.")
string NotificationsFeaturesListItem

structure NotificationsPluginFeatures {
    tooltip_support: Boolean
}
