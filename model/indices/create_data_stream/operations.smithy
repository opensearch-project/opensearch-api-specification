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
    "x-operation-group": "indices.create_data_stream",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_data_stream/{name}")
@documentation("Creates or updates a data stream.")
operation IndicesCreateDataStream {
    input: IndicesCreateDataStream_Input,
    output: IndicesCreateDataStream_Output
}
