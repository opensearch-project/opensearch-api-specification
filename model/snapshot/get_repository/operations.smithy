// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/snapshots/get-snapshot-repository/"
)

@xOperationGroup("snapshot.get_repository")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_snapshot")
@documentation("Returns information about a repository.")
operation SnapshotGetRepository {
    input: SnapshotGetRepository_Input,
    output: SnapshotGetRepository_Output
}

@xOperationGroup("snapshot.get_repository")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_snapshot/{repository}")
@documentation("Returns information about a repository.")
operation SnapshotGetRepository_WithRepository {
    input: SnapshotGetRepository_WithRepository_Input,
    output: SnapshotGetRepository_Output
}
