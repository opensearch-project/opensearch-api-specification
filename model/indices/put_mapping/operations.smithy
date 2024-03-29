// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/index-apis/put-mapping/"
)

@xOperationGroup("indices.put_mapping")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}/_mapping")
@documentation("Updates the index mappings.")
operation IndicesPutMapping_Put {
    input: IndicesPutMapping_Put_Input,
    output: IndicesPutMapping_Output
}

@xOperationGroup("indices.put_mapping")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_mapping")
@documentation("Updates the index mappings.")
operation IndicesPutMapping_Post {
    input: IndicesPutMapping_Post_Input,
    output: IndicesPutMapping_Output
}
