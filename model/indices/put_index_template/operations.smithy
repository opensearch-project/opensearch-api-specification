// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/im-plugin/index-templates/"
)

@vendorExtensions(
    "x-operation-group": "indices.put_index_template",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_index_template/{name}")
@documentation("Creates or updates an index template.")
operation IndicesPutIndexTemplate_Put {
    input: IndicesPutIndexTemplate_Put_Input,
    output: IndicesPutIndexTemplate_Output
}

@vendorExtensions(
    "x-operation-group": "indices.put_index_template",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_index_template/{name}")
@documentation("Creates or updates an index template.")
operation IndicesPutIndexTemplate_Post {
    input: IndicesPutIndexTemplate_Post_Input,
    output: IndicesPutIndexTemplate_Output
}
