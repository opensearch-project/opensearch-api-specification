//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/observing-your-data/notifications/api/#list-supported-channel-configurations"
)

@xOperationGroup("notifications.list_features")
@xVersionAdded("2.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_notifications/features")
@documentation("List supported channel configurations.")
operation NotificationsFeatures_Get {
    input: NotificationsFeatures_Get_Input,
    output: NotificationsFeatures_Get_Output
}
