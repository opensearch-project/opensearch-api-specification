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

@xOperationGroup("indices.delete_template")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_template/{name}")
@documentation("Deletes an index template.")
operation IndicesDeleteTemplate {
    input: IndicesDeleteTemplate_Input,
    output: IndicesDeleteTemplate_Output
}
