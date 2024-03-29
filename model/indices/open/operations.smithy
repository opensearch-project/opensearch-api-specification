// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/open-index/"
)

@xOperationGroup("indices.open")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_open")
@documentation("Opens an index.")
operation IndicesOpen {
    input: IndicesOpen_Input,
    output: IndicesOpen_Output
}
