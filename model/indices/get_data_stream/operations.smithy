// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/im-plugin/data-streams/"
)

@xOperationGroup("indices.get_data_stream")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_data_stream")
@documentation("Returns data streams.")
operation IndicesGetDataStream {
    input: IndicesGetDataStream_Input,
    output: IndicesGetDataStream_Output
}

@xOperationGroup("indices.get_data_stream")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_data_stream/{name}")
@documentation("Returns data streams.")
operation IndicesGetDataStream_WithName {
    input: IndicesGetDataStream_WithName_Input,
    output: IndicesGetDataStream_Output
}
