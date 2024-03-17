//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure NotificationsFeatureTest_Input {
    @required
    @httpLabel
    config_id: String
}

structure NotificationsFeatureTest_Output {
    event_source: EventSource,
    status_list: StatusList
}

structure EventSource {
    title: String,
    reference_id: String,
    severity: SeverityType,
    tags: TagsList
}

enum SeverityType {
    HIGH = "high",
    INFO = "info",
    CRITICAL = "critical"
}

list TagsList {
    member: String
}

list StatusList {
    member: EventStatus
}

structure EventStatus {
    config_id: String,
    config_name: String,
    config_type: NotificationConfigType,
    email_recipient_status: EmailRecipientStatusList,
    delivery_status: DeliveryStatus
}

list EmailRecipientStatusList {
    member: EmailRecipientStatus
}

structure EmailRecipientStatus {
    recipient: String,
    delivery_status: DeliveryStatus
}

structure DeliveryStatus {
    status_code: String,
    status_text: String
}
