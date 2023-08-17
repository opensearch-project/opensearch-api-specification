// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-aliases/"
)

@xOperationGroup("cat.aliases")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/aliases")
@documentation("Shows information about currently configured aliases to indices including filter and routing infos.")
operation CatAliases {
    input: CatAliases_Input,
    output: CatAliases_Output
}

@xOperationGroup("cat.aliases")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/aliases/{name}")
@documentation("Shows information about currently configured aliases to indices including filter and routing infos.")
operation CatAliases_WithName {
    input: CatAliases_WithName_Input,
    output: CatAliases_Output
}
