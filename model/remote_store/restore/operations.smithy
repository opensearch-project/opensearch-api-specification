// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/opensearch/remote/#restoring-from-a-backup"
)

@xOperationGroup("remote_store.restore")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_remotestore/_restore")
@documentation("Restores from remote store.")
operation RemoteStoreRestore {
    input: RemoteStoreRestore_Input,
    output: RemoteStoreRestore_Output
}

apply RemoteStoreRestore @examples([
    {
        title: "Examples for Post Remote Storage Restore Operation.",
        input: {
            content: {
                indices: ["books"]
            }
        },
        output: {
            remote_store: {
                indices: ["books"],
                shards: {
                    total: 1,
                    failed: 0,
                    successful: 1
                }
            }
        }
    }
])
