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
