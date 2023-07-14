// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/index/"
)

@vendorExtensions(
    "x-operation-group": "cat.help",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat")
@documentation("Returns help for the Cat APIs.")
operation CatHelp {
    input: CatHelp_Input,
    output: CatHelp_Output
}
