//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/observing-your-data/notifications/api/#delete-channel-configuration"
)

@xOperationGroup("notifications.delete_config")
@xVersionAdded("2.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_plugins/_notifications/configs/{config_id}")
@documentation("Delete channel configuration.")
operation NotificationsConfigs_Delete_WithPathParams {
    input: NotificationsConfigs_Delete_WithPathParams_Input,
    output: NotificationsConfigs_Delete_Output
}

@xOperationGroup("notifications.delete_config")
@xVersionAdded("2.2")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_plugins/_notifications/configs")
@documentation("Delete channel configuration.")
operation NotificationsConfigs_Delete_WithQueryParams {
    input: NotificationsConfigs_Delete_WithQueryParams_Input,
    output: NotificationsConfigs_Delete_Output
}
