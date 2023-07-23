// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/field-types/supported-field-types/alias/"
)

@vendorExtensions(
    "x-operation-group": "indices.put_alias",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}/_alias/{name}")
@documentation("Creates or updates an alias.")
operation IndicesPutAlias_Put {
    input: IndicesPutAlias_Put_Input,
    output: IndicesPutAlias_Output
}

@vendorExtensions(
    "x-operation-group": "indices.put_alias",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_alias/{name}")
@documentation("Creates or updates an alias.")
operation IndicesPutAlias_Post {
    input: IndicesPutAlias_Post_Input,
    output: IndicesPutAlias_Output
}

@vendorExtensions(
    "x-operation-group": "indices.put_alias",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}/_aliases/{name}")
@documentation("Creates or updates an alias.")
operation IndicesPutAlias_Put_Plural {
    input: IndicesPutAlias_Put_Plural_Input,
    output: IndicesPutAlias_Output
}

@vendorExtensions(
    "x-operation-group": "indices.put_alias",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_aliases/{name}")
@documentation("Creates or updates an alias.")
operation IndicesPutAlias_Post_Plural {
    input: IndicesPutAlias_Post_Plural_Input,
    output: IndicesPutAlias_Output
}
