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
    "x-operation-group": "indices.refresh",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_refresh")
@documentation("Performs the refresh operation in one or more indices.")
operation IndicesRefresh_Post {
    input: IndicesRefresh_Post_Input,
    output: IndicesRefresh_Output
}

@vendorExtensions(
    "x-operation-group": "indices.refresh",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_refresh")
@documentation("Performs the refresh operation in one or more indices.")
operation IndicesRefresh_Get {
    input: IndicesRefresh_Get_Input,
    output: IndicesRefresh_Output
}

@vendorExtensions(
    "x-operation-group": "indices.refresh",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_refresh")
@documentation("Performs the refresh operation in one or more indices.")
operation IndicesRefresh_Post_WithIndex {
    input: IndicesRefresh_Post_WithIndex_Input,
    output: IndicesRefresh_Output
}

@vendorExtensions(
    "x-operation-group": "indices.refresh",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_refresh")
@documentation("Performs the refresh operation in one or more indices.")
operation IndicesRefresh_Get_WithIndex {
    input: IndicesRefresh_Get_WithIndex_Input,
    output: IndicesRefresh_Output
}
