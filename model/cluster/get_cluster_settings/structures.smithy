// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure GetClusterSettingsInput with [ClusterManagerTimeout] {

    @httpQuery("flat_settings")
    flat_settings: Boolean,

    @httpQuery("include_defaults")
    include_defaults: Boolean,

}


structure GetClusterSettingsOutput {

    persistent: UserDefinedValueMap,

    transient: UserDefinedValueMap,

    defaults: UserDefinedValueMap,

}

apply GetClusterSettings @examples([
    {
        title: "Examples for Get cluster settings Operation.",
        input: {
            include_defaults: true
        }
    }
])
