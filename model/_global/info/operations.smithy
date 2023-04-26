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
    "x-operation-group": "info",
    "x-version-added": "1.0"
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/")
@documentation("Returns basic information about the cluster.")
operation Info {
    input: Info_Input,
    output: Info_Output
}
