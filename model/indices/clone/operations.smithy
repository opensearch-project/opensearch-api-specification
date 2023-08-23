// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/clone/"
)

@xOperationGroup("indices.clone")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}/_clone/{target}")
@documentation("Clones an index.")
operation IndicesClone_Put {
    input: IndicesClone_Put_Input,
    output: IndicesClone_Output
}

@xOperationGroup("indices.clone")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_clone/{target}")
@documentation("Clones an index.")
operation IndicesClone_Post {
    input: IndicesClone_Post_Input,
    output: IndicesClone_Output
}
