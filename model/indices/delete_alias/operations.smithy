// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@vendorExtensions(
    "x-operation-group": "indices.delete_alias",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/{index}/_alias/{name}")
@documentation("Deletes an alias.")
operation IndicesDeleteAlias {
    input: IndicesDeleteAlias_Input,
    output: IndicesDeleteAlias_Output
}

@vendorExtensions(
    "x-operation-group": "indices.delete_alias",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/{index}/_aliases/{name}")
@documentation("Deletes an alias.")
operation IndicesDeleteAlias_Plural {
    input: IndicesDeleteAlias_Plural_Input,
    output: IndicesDeleteAlias_Output
}
