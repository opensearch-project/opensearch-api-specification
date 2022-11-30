// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "OpenSearch Documentation": "https://opensearch.org/docs/latest/opensearch/remote/#restoring-from-a-backup"
)

@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_remotestore/_restore")
@documentation("Restore one or more indices from a remote backup.")
operation PostRemoteStoreRestore{
    input: PostRemoteStoreRestoreInput,
    output: PostRemoteStoreRestoreOutput
}
