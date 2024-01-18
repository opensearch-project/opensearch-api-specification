//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/observing-your-data/notifications/api/#get-channel-configuration"
)

@xOperationGroup("notifications.get_config")
@xVersionAdded("2.2")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_notifications/configs")
@documentation("Retrieves information about notification configurations.")
operation NotificationsConfigs_Get {
    input: NotificationsConfigs_Get_Input,
    output: NotificationsConfigs_Get_Output
}

@xOperationGroup("notifications.get_config")
@xVersionAdded("2.2")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_notifications/configs/{config_id}")
@documentation("Retrieves information about notification configurations.")
operation NotificationsConfigsItem_Get {
    input: NotificationsConfigsItem_Get_Input,
    output: NotificationsConfigs_Get_Output
}
