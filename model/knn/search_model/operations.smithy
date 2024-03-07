// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/knn/api/#search-model"
)

@xOperationGroup("knn.search_models")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_knn/models/_search")
@documentation("Use an OpenSearch query to search for models in the index.")
operation KNNSearchModels_Get {
    input: KNNSearchModels_Get_Input,
    output: KNNSearchModels_Output
}

@xOperationGroup("knn.search_models")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_plugins/_knn/models/_search")
@documentation("Use an OpenSearch query to search for models in the index.")
operation KNNSearchModels_Post {
    input: KNNSearchModels_Post_Input,
    output: KNNSearchModels_Output
}
