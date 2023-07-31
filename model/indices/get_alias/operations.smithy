// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/im-plugin/index-alias/"
)

@vendorExtensions(
    "x-operation-group": "indices.get_alias",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_alias")
@documentation("Returns an alias.")
operation IndicesGetAlias {
    input: IndicesGetAlias_Input,
    output: IndicesGetAlias_Output
}

@vendorExtensions(
    "x-operation-group": "indices.get_alias",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_alias")
@documentation("Returns an alias.")
operation IndicesGetAlias_WithIndex {
    input: IndicesGetAlias_WithIndex_Input,
    output: IndicesGetAlias_Output
}

@vendorExtensions(
    "x-operation-group": "indices.get_alias",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_alias/{name}")
@documentation("Returns an alias.")
operation IndicesGetAlias_WithName {
    input: IndicesGetAlias_WithName_Input,
    output: IndicesGetAlias_Output
}

@vendorExtensions(
    "x-operation-group": "indices.get_alias",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_alias/{name}")
@documentation("Returns an alias.")
operation IndicesGetAlias_WithIndexName {
    input: IndicesGetAlias_WithIndexName_Input,
    output: IndicesGetAlias_Output
}
