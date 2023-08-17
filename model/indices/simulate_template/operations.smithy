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

@xOperationGroup("indices.simulate_template")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_index_template/_simulate")
@documentation("Simulate resolving the given template name or body.")
operation IndicesSimulateTemplate {
    input: IndicesSimulateTemplate_Input,
    output: IndicesSimulateTemplate_Output
}

@xOperationGroup("indices.simulate_template")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_index_template/_simulate/{name}")
@documentation("Simulate resolving the given template name or body.")
operation IndicesSimulateTemplate_WithName {
    input: IndicesSimulateTemplate_WithName_Input,
    output: IndicesSimulateTemplate_Output
}
