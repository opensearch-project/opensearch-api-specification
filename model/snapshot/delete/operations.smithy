// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/snapshots/delete-snapshot/"
)

@vendorExtensions(
    "x-operation-group": "snapshot.delete",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_snapshot/{repository}/{snapshot}")
@documentation("Deletes a snapshot.")
operation SnapshotDelete {
    input: SnapshotDelete_Input,
    output: SnapshotDelete_Output
}
