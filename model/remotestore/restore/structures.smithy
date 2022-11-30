// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@unstable
structure PostRemoteStoreRestoreInput {
    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: Time,

    @httpQuery("wait_for_completion")
    wait_for_completion: Boolean,

    @required
    indices: IndexNameList
}

@unstable
structure PostRemoteStoreRestoreOutput {
    accepted: Boolean,

    remote_store: RemoteStoreRestoreInfo
}

@unstable
structure RemoteStoreRestoreInfo {
    snapshot: String,
    indices: IndexNameList,
    shards: RemoteStoreRestoreShardsInfo
}

@unstable
structure RemoteStoreRestoreShardsInfo {
    total: Integer,
    failed: Integer,
    successful: Integer
}
