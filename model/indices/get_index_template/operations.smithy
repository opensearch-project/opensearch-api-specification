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

@xOperationGroup("indices.get_index_template")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_index_template")
@documentation("Returns an index template.")
operation IndicesGetIndexTemplate {
    input: IndicesGetIndexTemplate_Input,
    output: IndicesGetIndexTemplate_Output
}

@xOperationGroup("indices.get_index_template")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_index_template/{name}")
@documentation("Returns an index template.")
operation IndicesGetIndexTemplate_WithName {
    input: IndicesGetIndexTemplate_WithName_Input,
    output: IndicesGetIndexTemplate_Output
}
