// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/field-types/index/#get-a-mapping"
)

@xOperationGroup("indices.get_mapping")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_mapping")
@documentation("Returns mappings for one or more indices.")
operation IndicesGetMapping {
    input: IndicesGetMapping_Input,
    output: IndicesGetMapping_Output
}

@xOperationGroup("indices.get_mapping")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_mapping")
@documentation("Returns mappings for one or more indices.")
operation IndicesGetMapping_WithIndex {
    input: IndicesGetMapping_WithIndex_Input,
    output: IndicesGetMapping_Output
}
