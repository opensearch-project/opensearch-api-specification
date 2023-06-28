// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/snapshots/create-snapshot/"
)

@vendorExtensions(
    "x-operation-group": "snapshot.create",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_snapshot/{repository}/{snapshot}")
@documentation("Creates a snapshot in a repository.")
operation SnapshotCreate_Put {
    input: SnapshotCreate_Put_Input,
    output: SnapshotCreate_Output
}

@vendorExtensions(
    "x-operation-group": "snapshot.create",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_snapshot/{repository}/{snapshot}")
@documentation("Creates a snapshot in a repository.")
operation SnapshotCreate_Post {
    input: SnapshotCreate_Post_Input,
    output: SnapshotCreate_Output
}
