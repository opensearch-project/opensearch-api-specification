// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@xOperationGroup("cluster.delete_component_template")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_component_template/{name}")
@documentation("Deletes a component template.")
operation ClusterDeleteComponentTemplate {
    input: ClusterDeleteComponentTemplate_Input,
    output: ClusterDeleteComponentTemplate_Output
}
