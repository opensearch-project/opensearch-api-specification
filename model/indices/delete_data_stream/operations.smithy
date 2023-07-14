// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/im-plugin/data-streams/"
)

@vendorExtensions(
    "x-operation-group": "indices.delete_data_stream",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_data_stream/{name}")
@documentation("Deletes a data stream.")
operation IndicesDeleteDataStream {
    input: IndicesDeleteDataStream_Input,
    output: IndicesDeleteDataStream_Output
}
