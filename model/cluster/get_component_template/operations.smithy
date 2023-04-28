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

@vendorExtensions(
    "x-operation-group": "cluster.get_component_template",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_component_template")
@documentation("Returns one or more component templates.")
operation ClusterGetComponentTemplate {
    input: ClusterGetComponentTemplate_Input,
    output: ClusterGetComponentTemplate_Output
}

@vendorExtensions(
    "x-operation-group": "cluster.get_component_template",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_component_template/{name}")
@documentation("Returns one or more component templates.")
operation ClusterGetComponentTemplate_WithName {
    input: ClusterGetComponentTemplate_WithName_Input,
    output: ClusterGetComponentTemplate_Output
}
