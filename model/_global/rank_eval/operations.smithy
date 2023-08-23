// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/rank-eval/"
)

@xOperationGroup("rank_eval")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_rank_eval")
@documentation("Allows to evaluate the quality of ranked search results over a set of typical search queries.")
operation RankEval_Get {
    input: RankEval_Get_Input,
    output: RankEval_Output
}

@xOperationGroup("rank_eval")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_rank_eval")
@documentation("Allows to evaluate the quality of ranked search results over a set of typical search queries.")
operation RankEval_Post {
    input: RankEval_Post_Input,
    output: RankEval_Output
}

@xOperationGroup("rank_eval")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_rank_eval")
@documentation("Allows to evaluate the quality of ranked search results over a set of typical search queries.")
operation RankEval_Get_WithIndex {
    input: RankEval_Get_WithIndex_Input,
    output: RankEval_Output
}

@xOperationGroup("rank_eval")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_rank_eval")
@documentation("Allows to evaluate the quality of ranked search results over a set of typical search queries.")
operation RankEval_Post_WithIndex {
    input: RankEval_Post_WithIndex_Input,
    output: RankEval_Output
}
