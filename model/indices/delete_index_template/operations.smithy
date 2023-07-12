// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/im-plugin/index-templates/#delete-a-template"
)

@vendorExtensions(
    "x-operation-group": "indices.delete_index_template",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_index_template/{name}")
@documentation("Deletes an index template.")
operation IndicesDeleteIndexTemplate {
    input: IndicesDeleteIndexTemplate_Input,
    output: IndicesDeleteIndexTemplate_Output
}
