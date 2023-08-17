// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-snapshots/"
)

@xOperationGroup("cat.snapshots")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/snapshots")
@documentation("Returns all snapshots in a specific repository.")
operation CatSnapshots {
    input: CatSnapshots_Input,
    output: CatSnapshots_Output
}

@xOperationGroup("cat.snapshots")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/snapshots/{repository}")
@documentation("Returns all snapshots in a specific repository.")
operation CatSnapshots_WithRepository {
    input: CatSnapshots_WithRepository_Input,
    output: CatSnapshots_Output
}
