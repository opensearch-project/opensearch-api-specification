// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@xOperationGroup("snapshot.cleanup_repository")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_snapshot/{repository}/_cleanup")
@documentation("Removes stale data from repository.")
operation SnapshotCleanupRepository {
    input: SnapshotCleanupRepository_Input,
    output: SnapshotCleanupRepository_Output
}
