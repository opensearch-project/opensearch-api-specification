// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure RemoteStoreRestore_QueryParams {
    @httpQuery("cluster_manager_timeout")
    query_cluster_manager_timeout: ClusterManagerTimeout,

    @httpQuery("wait_for_completion")
    @default(false)
    query_wait_for_completion: WaitForCompletionFalse,
}

@mixin
structure RemoteStoreRestore_BodyParams {
    @required
    indices: IndexNames
}

@input
structure RemoteStoreRestore_Input with [RemoteStoreRestore_QueryParams, RemoteStoreRestore_BodyParams] {
}

@unstable
structure RemoteStoreRestore_Output {
    accepted: Boolean,
    remote_store: RemoteStoreRestoreInfo
}

@unstable
structure RemoteStoreRestoreInfo {
    snapshot: String,
    indices: IndexNames,
    shards: RemoteStoreRestoreShardsInfo
}

@unstable
structure RemoteStoreRestoreShardsInfo {
    total: Integer,
    failed: Integer,
    successful: Integer
}
