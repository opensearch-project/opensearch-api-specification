// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/snapshots/create-repository/"
)

@xOperationGroup("snapshot.create_repository")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_snapshot/{repository}")
@documentation("Creates a repository.")
operation SnapshotCreateRepository_Put {
    input: SnapshotCreateRepository_Put_Input,
    output: SnapshotCreateRepository_Output
}

@xOperationGroup("snapshot.create_repository")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_snapshot/{repository}")
@documentation("Creates a repository.")
operation SnapshotCreateRepository_Post {
    input: SnapshotCreateRepository_Post_Input,
    output: SnapshotCreateRepository_Output
}
