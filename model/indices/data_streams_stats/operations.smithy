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

@xOperationGroup("indices.data_streams_stats")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_data_stream/_stats")
@documentation("Provides statistics on operations happening in a data stream.")
operation IndicesDataStreamsStats {
    input: IndicesDataStreamsStats_Input,
    output: IndicesDataStreamsStats_Output
}

@xOperationGroup("indices.data_streams_stats")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_data_stream/{name}/_stats")
@documentation("Provides statistics on operations happening in a data stream.")
operation IndicesDataStreamsStats_WithName {
    input: IndicesDataStreamsStats_WithName_Input,
    output: IndicesDataStreamsStats_Output
}
