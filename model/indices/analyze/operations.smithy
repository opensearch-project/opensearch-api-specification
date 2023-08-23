// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/analyze-apis/perform-text-analysis/"
)

@xOperationGroup("indices.analyze")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_analyze")
@documentation("Performs the analysis process on a text and return the tokens breakdown of the text.")
operation IndicesAnalyze_Get {
    input: IndicesAnalyze_Get_Input,
    output: IndicesAnalyze_Output
}

@xOperationGroup("indices.analyze")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_analyze")
@documentation("Performs the analysis process on a text and return the tokens breakdown of the text.")
operation IndicesAnalyze_Post {
    input: IndicesAnalyze_Post_Input,
    output: IndicesAnalyze_Output
}

@xOperationGroup("indices.analyze")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_analyze")
@documentation("Performs the analysis process on a text and return the tokens breakdown of the text.")
operation IndicesAnalyze_Get_WithIndex {
    input: IndicesAnalyze_Get_WithIndex_Input,
    output: IndicesAnalyze_Output
}

@xOperationGroup("indices.analyze")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_analyze")
@documentation("Performs the analysis process on a text and return the tokens breakdown of the text.")
operation IndicesAnalyze_Post_WithIndex {
    input: IndicesAnalyze_Post_WithIndex_Input,
    output: IndicesAnalyze_Output
}
