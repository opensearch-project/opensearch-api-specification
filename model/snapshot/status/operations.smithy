// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/snapshots/get-snapshot-status/"
)

@xOperationGroup("snapshot.status")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_snapshot/_status")
@documentation("Returns information about the status of a snapshot.")
operation SnapshotStatus {
    input: SnapshotStatus_Input,
    output: SnapshotStatus_Output
}

@xOperationGroup("snapshot.status")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_snapshot/{repository}/_status")
@documentation("Returns information about the status of a snapshot.")
operation SnapshotStatus_WithRepository {
    input: SnapshotStatus_WithRepository_Input,
    output: SnapshotStatus_Output
}

@xOperationGroup("snapshot.status")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_snapshot/{repository}/{snapshot}/_status")
@documentation("Returns information about the status of a snapshot.")
operation SnapshotStatus_WithRepositorySnapshot {
    input: SnapshotStatus_WithRepositorySnapshot_Input,
    output: SnapshotStatus_Output
}
