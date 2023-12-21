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

@xOperationGroup("notifications.configs")
@xVersionAdded("2.2")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_notifications/configs")
@documentation("Retrieves all notification configurations.")
operation NotificationsConfigs_Get {
    input: NotificationsConfigs_Get_Input,
    output: NotificationsConfigs_Get_Output
}

@xOperationGroup("notifications.configs")
@xVersionAdded("2.2")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_plugins/_notifications/configs")
@documentation("Creates a notification channel configuration.")
operation NotificationsConfigs_Post {
    input: NotificationsConfigs_Post_Input,
    output: NotificationsConfigs_Post_Output
}
