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
    "x-operation-group": "cluster.put_component_template",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_component_template/{name}")
@documentation("Creates or updates a component template.")
operation ClusterPutComponentTemplate_Put {
    input: ClusterPutComponentTemplate_Put_Input,
    output: ClusterPutComponentTemplate_Output
}

@vendorExtensions(
    "x-operation-group": "cluster.put_component_template",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_component_template/{name}")
@documentation("Creates or updates a component template.")
operation ClusterPutComponentTemplate_Post {
    input: ClusterPutComponentTemplate_Post_Input,
    output: ClusterPutComponentTemplate_Output
}
