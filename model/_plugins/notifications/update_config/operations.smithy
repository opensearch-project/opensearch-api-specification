//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/observing-your-data/notifications/api/#update-channel-configuration"
)

@xOperationGroup("notifications.update_config")
@xVersionAdded("2.2")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_plugins/_notifications/configs/{config_id}")
@documentation("Updates a notification channel configuration.")
operation NotificationsConfigs_Put {
    input: NotificationsConfigs_Put_Input,
    output: NotificationsConfigs_Put_Output
}
