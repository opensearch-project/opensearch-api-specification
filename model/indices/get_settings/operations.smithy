// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "OpenSearch Documentation": "https://opensearch.org/docs/2.0/opensearch/rest-api/index-apis/get-settings/"
)

@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_settings")
@documentation("The get settings API operation returns all the settings in your index.")
operation GetSettingsIndex{
    input: GetSettingsIndexInput,
    output: GetSettingsIndexOutput
}


@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_settings/{setting}")
@documentation("The get settings API operation returns all the settings in your index.")
operation GetSettingsIndexSetting {
    input: GetSettingsIndexSettingInput,
    output: GetSettingsIndexSettingOutput
}
