//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/observing-your-data/notifications/api/#send-test-notification"
)

@xOperationGroup("notifications.feature.test")
@xVersionAdded("2.2")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_notifications/feature/test/{config_id}")
@documentation("Send a test notification.")
operation NotificationsFeatureTest_Get {
    input: NotificationsFeatureTest_Input,
    output: NotificationsFeatureTest_Output
}

@xOperationGroup("notifications.feature.test")
@xVersionAdded("2.2")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_plugins/_notifications/feature/test/{config_id}")
@documentation("Send a test notification.")
operation NotificationsFeatureTest_Post {
    input: NotificationsFeatureTest_Input,
    output: NotificationsFeatureTest_Output
}
