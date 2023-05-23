// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@deprecated
@vendorExtensions(
    "x-operation-group": "cat.master",
    "x-version-added": "1.0",
    "x-deprecation-message": "To promote inclusive language, please use '/_cat/cluster_manager' instead.",
    "x-version-deprecated": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/master")
@documentation("Returns information about the cluster-manager node.")
operation CatMaster {
    input: CatMaster_Input,
    output: CatMaster_Output
}
