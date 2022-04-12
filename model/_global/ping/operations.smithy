// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/")
@documentation("Returns whether the cluster is running.")
operation GetPingCluster {
    input: GetPingClusterInput,
    output: GetPingClusterOutput
}

