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

@xOperationGroup("indices.simulate_index_template")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_index_template/_simulate_index/{name}")
@documentation("Simulate matching the given index name against the index templates in the system.")
operation IndicesSimulateIndexTemplate {
    input: IndicesSimulateIndexTemplate_Input,
    output: IndicesSimulateIndexTemplate_Output
}
