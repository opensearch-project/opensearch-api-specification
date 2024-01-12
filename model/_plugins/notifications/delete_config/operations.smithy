//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/observing-your-data/notifications/api/"
)

@xOperationGroup("notifications.delete_config")
@xVersionAdded("2.2")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_plugins/_notifications/configs/{config_id}")
@documentation("Deletes a notification channel configuration.")
operation NotificationsConfigs_Delete {
    input: NotificationsConfigs_Delete_Input,
    output: NotificationsConfigs_Delete_Output
}

@xOperationGroup("notifications.delete_config")
@xVersionAdded("2.2")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_plugins/_notifications/configs")
@documentation("Deletes a notification channel configuration.")
operation NotificationsConfigs_Delete_WithParams {
    input: NotificationsConfigs_Delete_WithParams_Input,
    output: NotificationsConfigs_Delete_Output
}
