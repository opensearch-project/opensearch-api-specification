// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/snapshots/verify-snapshot-repository/"
)

@xOperationGroup("snapshot.verify_repository")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_snapshot/{repository}/_verify")
@documentation("Verifies a repository.")
operation SnapshotVerifyRepository {
    input: SnapshotVerifyRepository_Input,
    output: SnapshotVerifyRepository_Output
}
