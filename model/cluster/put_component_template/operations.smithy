// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/im-plugin/index-templates/#use-component-templates-to-create-an-index-template"
)

@xOperationGroup("cluster.put_component_template")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_component_template/{name}")
@documentation("Creates or updates a component template.")
operation ClusterPutComponentTemplate_Put {
    input: ClusterPutComponentTemplate_Put_Input,
    output: ClusterPutComponentTemplate_Output
}

@xOperationGroup("cluster.put_component_template")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_component_template/{name}")
@documentation("Creates or updates a component template.")
operation ClusterPutComponentTemplate_Post {
    input: ClusterPutComponentTemplate_Post_Input,
    output: ClusterPutComponentTemplate_Output
}
