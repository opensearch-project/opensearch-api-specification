// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/field-types/index/"
)

@xOperationGroup("indices.get_field_mapping")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_mapping/field/{fields}")
@documentation("Returns mapping for one or more fields.")
operation IndicesGetFieldMapping {
    input: IndicesGetFieldMapping_Input,
    output: IndicesGetFieldMapping_Output
}

@xOperationGroup("indices.get_field_mapping")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_mapping/field/{fields}")
@documentation("Returns mapping for one or more fields.")
operation IndicesGetFieldMapping_WithIndex {
    input: IndicesGetFieldMapping_WithIndex_Input,
    output: IndicesGetFieldMapping_Output
}
