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

@xOperationGroup("snapshot.clone")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_snapshot/{repository}/{snapshot}/_clone/{target_snapshot}")
@documentation("Clones indices from one snapshot into another snapshot in the same repository.")
operation SnapshotClone {
    input: SnapshotClone_Input,
    output: SnapshotClone_Output
}
