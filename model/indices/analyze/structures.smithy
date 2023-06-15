// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesAnalyze_QueryParams {
    @httpQuery("index")
    @documentation("The name of the index to scope the operation.")
    query_index: Index,
}

// TODO: Fill in Body Parameters
@documentation("Define analyzer/tokenizer parameters and the text on which the analysis should be performed")
structure IndicesAnalyze_BodyParams {}

@input
structure IndicesAnalyze_Get_Input with [IndicesAnalyze_QueryParams] {
}

@input
structure IndicesAnalyze_Post_Input with [IndicesAnalyze_QueryParams] {
    @httpPayload
    content: IndicesAnalyze_BodyParams,
}

@input
structure IndicesAnalyze_Get_WithIndex_Input with [IndicesAnalyze_QueryParams] {
    @required
    @httpLabel
    @documentation("The name of the index to scope the operation.")
    index: PathIndex,
}

@input
structure IndicesAnalyze_Post_WithIndex_Input with [IndicesAnalyze_QueryParams] {
    @required
    @httpLabel
    @documentation("The name of the index to scope the operation.")
    index: PathIndex,
    @httpPayload
    content: IndicesAnalyze_BodyParams,
}

// TODO: Fill in Output Structure
structure IndicesAnalyze_Output {}
