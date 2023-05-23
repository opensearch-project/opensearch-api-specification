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
    "API Reference": "https://opensearch.org/docs/latest"
)

@vendorExtensions(
    "x-operation-group": "cat.snapshots",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/snapshots")
@documentation("Returns all snapshots in a specific repository.")
operation CatSnapshots {
    input: CatSnapshots_Input,
    output: CatSnapshots_Output
}

@vendorExtensions(
    "x-operation-group": "cat.snapshots",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/snapshots/{repository}")
@documentation("Returns all snapshots in a specific repository.")
operation CatSnapshots_WithRepository {
    input: CatSnapshots_WithRepository_Input,
    output: CatSnapshots_Output
}
