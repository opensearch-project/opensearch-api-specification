// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/get-index/"
)

@xOperationGroup("indices.get")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}")
@documentation("Returns information about one or more indices.")
operation IndicesGet {
    input: IndicesGet_Input,
    output: IndicesGet_Output
}
