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
    "x-operation-group": "index",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}/_doc/{id}")
@documentation("Creates or updates a document in an index.")
operation Index_Put_WithId {
    input: Index_Put_WithId_Input,
    output: Index_Output
}

@vendorExtensions(
    "x-operation-group": "index",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_doc/{id}")
@documentation("Creates or updates a document in an index.")
operation Index_Post_WithId {
    input: Index_Post_WithId_Input,
    output: Index_Output
}

@vendorExtensions(
    "x-operation-group": "index",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_doc")
@documentation("Creates or updates a document in an index.")
operation Index_Post {
    input: Index_Post_Input,
    output: Index_Output
}
