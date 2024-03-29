// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/im-plugin/index-templates/"
)

@xOperationGroup("indices.exists_index_template")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@readonly
@http(method: "HEAD", uri: "/_index_template/{name}")
@documentation("Returns information about whether a particular index template exists.")
operation IndicesExistsIndexTemplate {
    input: IndicesExistsIndexTemplate_Input,
    output: IndicesExistsIndexTemplate_Output
}
