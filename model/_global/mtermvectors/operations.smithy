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

@xOperationGroup("mtermvectors")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_mtermvectors")
@documentation("Returns multiple termvectors in one request.")
operation Mtermvectors_Get {
    input: Mtermvectors_Get_Input,
    output: Mtermvectors_Output
}

@xOperationGroup("mtermvectors")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_mtermvectors")
@documentation("Returns multiple termvectors in one request.")
operation Mtermvectors_Post {
    input: Mtermvectors_Post_Input,
    output: Mtermvectors_Output
}

@xOperationGroup("mtermvectors")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_mtermvectors")
@documentation("Returns multiple termvectors in one request.")
operation Mtermvectors_Get_WithIndex {
    input: Mtermvectors_Get_WithIndex_Input,
    output: Mtermvectors_Output
}

@xOperationGroup("mtermvectors")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_mtermvectors")
@documentation("Returns multiple termvectors in one request.")
operation Mtermvectors_Post_WithIndex {
    input: Mtermvectors_Post_WithIndex_Input,
    output: Mtermvectors_Output
}
