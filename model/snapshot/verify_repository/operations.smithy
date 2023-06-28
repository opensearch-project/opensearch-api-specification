// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/snapshots/verify-snapshot-repository/"
)

@vendorExtensions(
    "x-operation-group": "snapshot.verify_repository",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_snapshot/{repository}/_verify")
@documentation("Verifies a repository.")
operation SnapshotVerifyRepository {
    input: SnapshotVerifyRepository_Input,
    output: SnapshotVerifyRepository_Output
}
