// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/im-plugin/index-alias/#delete-aliases"
)

@xOperationGroup("indices.delete_alias")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/{index}/_alias/{name}")
@documentation("Deletes an alias.")
operation IndicesDeleteAlias {
    input: IndicesDeleteAlias_Input,
    output: IndicesDeleteAlias_Output
}

@xOperationGroup("indices.delete_alias")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/{index}/_aliases/{name}")
@documentation("Deletes an alias.")
operation IndicesDeleteAlias_Plural {
    input: IndicesDeleteAlias_Plural_Input,
    output: IndicesDeleteAlias_Output
}
