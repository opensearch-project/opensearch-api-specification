// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@xOperationGroup("indices.flush")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_flush")
@documentation("Performs the flush operation on one or more indices.")
operation IndicesFlush_Post {
    input: IndicesFlush_Post_Input,
    output: IndicesFlush_Output
}

@xOperationGroup("indices.flush")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_flush")
@documentation("Performs the flush operation on one or more indices.")
operation IndicesFlush_Get {
    input: IndicesFlush_Get_Input,
    output: IndicesFlush_Output
}

@xOperationGroup("indices.flush")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_flush")
@documentation("Performs the flush operation on one or more indices.")
operation IndicesFlush_Post_WithIndex {
    input: IndicesFlush_Post_WithIndex_Input,
    output: IndicesFlush_Output
}

@xOperationGroup("indices.flush")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_flush")
@documentation("Performs the flush operation on one or more indices.")
operation IndicesFlush_Get_WithIndex {
    input: IndicesFlush_Get_WithIndex_Input,
    output: IndicesFlush_Output
}
