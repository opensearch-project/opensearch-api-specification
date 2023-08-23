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

@xOperationGroup("indices.exists_template")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@readonly
@http(method: "HEAD", uri: "/_template/{name}")
@documentation("Returns information about whether a particular index template exists.")
operation IndicesExistsTemplate {
    input: IndicesExistsTemplate_Input,
    output: IndicesExistsTemplate_Output
}
