// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/explain/"
)

@xOperationGroup("explain")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_explain/{id}")
@documentation("Returns information about why a specific matches (or doesn't match) a query.")
operation Explain_Get {
    input: Explain_Get_Input,
    output: Explain_Output
}

@xOperationGroup("explain")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_explain/{id}")
@documentation("Returns information about why a specific matches (or doesn't match) a query.")
operation Explain_Post {
    input: Explain_Post_Input,
    output: Explain_Output
}
