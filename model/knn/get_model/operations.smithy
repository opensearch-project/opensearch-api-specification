// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/knn/api/#get-model"
)

@xOperationGroup("knn.get_model")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_knn/models/{model_id}")
@documentation("Used to retrieve information about models present in the cluster.")
operation KNNGetModel {
    input: KNNGetModel_Input,
    output: KNNGetModel_Output
}
