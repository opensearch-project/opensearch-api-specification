// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/remote-info/"
)

@vendorExtensions(
    "x-operation-group": "cluster.remote_info",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_remote/info")
@documentation("Returns the information about configured remote clusters.")
operation ClusterRemoteInfo {
    input: ClusterRemoteInfo_Input,
    output: ClusterRemoteInfo_Output
}
