// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-cluster_manager/"
)

@deprecated
@xOperationGroup("cat.master")
@xVersionAdded("1.0")
@xDeprecationMessage("To promote inclusive language, please use '/_cat/cluster_manager' instead.")
@xVersionDeprecated("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/master")
@documentation("Returns information about the cluster-manager node.")
operation CatMaster {
    input: CatMaster_Input,
    output: CatMaster_Output
}
