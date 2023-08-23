// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/alias/"
)

@xOperationGroup("indices.update_aliases")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_aliases")
@documentation("Updates index aliases.")
operation IndicesUpdateAliases {
    input: IndicesUpdateAliases_Input,
    output: IndicesUpdateAliases_Output
}
