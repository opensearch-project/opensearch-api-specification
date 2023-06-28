// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/field-types/supported-field-types/alias/#using-aliases-in-field-capabilities-api-operations"
)

@vendorExtensions(
    "x-operation-group": "field_caps",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_field_caps")
@documentation("Returns the information about the capabilities of fields among multiple indices.")
operation FieldCaps_Get {
    input: FieldCaps_Get_Input,
    output: FieldCaps_Output
}

@vendorExtensions(
    "x-operation-group": "field_caps",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_field_caps")
@documentation("Returns the information about the capabilities of fields among multiple indices.")
operation FieldCaps_Post {
    input: FieldCaps_Post_Input,
    output: FieldCaps_Output
}

@vendorExtensions(
    "x-operation-group": "field_caps",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_field_caps")
@documentation("Returns the information about the capabilities of fields among multiple indices.")
operation FieldCaps_Get_WithIndex {
    input: FieldCaps_Get_WithIndex_Input,
    output: FieldCaps_Output
}

@vendorExtensions(
    "x-operation-group": "field_caps",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_field_caps")
@documentation("Returns the information about the capabilities of fields among multiple indices.")
operation FieldCaps_Post_WithIndex {
    input: FieldCaps_Post_WithIndex_Input,
    output: FieldCaps_Output
}
