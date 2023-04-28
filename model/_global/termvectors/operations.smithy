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
    "x-operation-group": "termvectors",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_termvectors")
@documentation("Returns information and statistics about terms in the fields of a particular document.")
operation Termvectors_Get {
    input: Termvectors_Get_Input,
    output: Termvectors_Output
}

@vendorExtensions(
    "x-operation-group": "termvectors",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_termvectors")
@documentation("Returns information and statistics about terms in the fields of a particular document.")
operation Termvectors_Post {
    input: Termvectors_Post_Input,
    output: Termvectors_Output
}

@vendorExtensions(
    "x-operation-group": "termvectors",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_termvectors/{id}")
@documentation("Returns information and statistics about terms in the fields of a particular document.")
operation Termvectors_Get_WithId {
    input: Termvectors_Get_WithId_Input,
    output: Termvectors_Output
}

@vendorExtensions(
    "x-operation-group": "termvectors",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_termvectors/{id}")
@documentation("Returns information and statistics about terms in the fields of a particular document.")
operation Termvectors_Post_WithId {
    input: Termvectors_Post_WithId_Input,
    output: Termvectors_Output
}
