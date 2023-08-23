// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/document-apis/get-documents/"
)

@xOperationGroup("exists_source")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@readonly
@http(method: "HEAD", uri: "/{index}/_source/{id}")
@documentation("Returns information about whether a document source exists in an index.")
operation ExistsSource {
    input: ExistsSource_Input,
    output: ExistsSource_Output
}
