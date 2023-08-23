// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/snapshots/restore-snapshot/"
)

@xOperationGroup("snapshot.restore")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_snapshot/{repository}/{snapshot}/_restore")
@documentation("Restores a snapshot.")
operation SnapshotRestore {
    input: SnapshotRestore_Input,
    output: SnapshotRestore_Output
}
