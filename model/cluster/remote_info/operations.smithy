// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/remote-info/"
)

@xOperationGroup("cluster.remote_info")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_remote/info")
@documentation("Returns the information about configured remote clusters.")
operation ClusterRemoteInfo {
    input: ClusterRemoteInfo_Input,
    output: ClusterRemoteInfo_Output
}
