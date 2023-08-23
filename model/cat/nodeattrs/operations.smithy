// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-nodeattrs/"
)

@xOperationGroup("cat.nodeattrs")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/nodeattrs")
@documentation("Returns information about custom node attributes.")
operation CatNodeattrs {
    input: CatNodeattrs_Input,
    output: CatNodeattrs_Output
}
