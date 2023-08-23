// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/update-settings/"
)

@xOperationGroup("indices.put_settings")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_settings")
@documentation("Updates the index settings.")
operation IndicesPutSettings {
    input: IndicesPutSettings_Input,
    output: IndicesPutSettings_Output
}

@xOperationGroup("indices.put_settings")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}/_settings")
@documentation("Updates the index settings.")
operation IndicesPutSettings_WithIndex {
    input: IndicesPutSettings_WithIndex_Input,
    output: IndicesPutSettings_Output
}
