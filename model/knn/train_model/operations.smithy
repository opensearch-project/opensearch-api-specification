// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/knn/api/#train-model"
)

@xOperationGroup("knn.train_model")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_plugins/_knn/models/_train")
@documentation("Create and train a model that can be used for initializing k-NN native library indexes during indexing.")
operation KNNTrainModel {
    input: KNNTrainModel_Input,
    output: KNNTrainModel_Output
}

@xOperationGroup("knn.train_model")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_plugins/_knn/models/{model_id}/_train")
@documentation("Create and train a model that can be used for initializing k-NN native library indexes during indexing.")
operation KNNTrainModel_WithModelId {
    input: KNNTrainModel_WithModelId_Input,
    output: KNNTrainModel_Output
}
