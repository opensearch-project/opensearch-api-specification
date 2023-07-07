// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/document-apis/multi-get/"
)

@vendorExtensions(
    "x-operation-group": "mget",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_mget")
@documentation("Allows to get multiple documents in one request.")
operation Mget_Get {
    input: Mget_Get_Input,
    output: Mget_Output
}

@vendorExtensions(
    "x-operation-group": "mget",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_mget")
@documentation("Allows to get multiple documents in one request.")
operation Mget_Post {
    input: Mget_Post_Input,
    output: Mget_Output
}

@vendorExtensions(
    "x-operation-group": "mget",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_mget")
@documentation("Allows to get multiple documents in one request.")
operation Mget_Get_WithIndex {
    input: Mget_Get_WithIndex_Input,
    output: Mget_Output
}

@vendorExtensions(
    "x-operation-group": "mget",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_mget")
@documentation("Allows to get multiple documents in one request.")
operation Mget_Post_WithIndex {
    input: Mget_Post_WithIndex_Input,
    output: Mget_Output
}
