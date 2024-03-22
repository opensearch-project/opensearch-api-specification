// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/knn/api/#delete-model"
)

@xOperationGroup("knn.delete_model")
@xVersionAdded("1.0")
@suppress(["HttpMethodSemantics.UnexpectedPayload"])
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_plugins/_knn/models/{model_id}")
@documentation("Used to delete a particular model in the cluster.")
operation KNNDeleteModel {
    input: KNNDeleteModel_Input,
    output: KNNDeleteModel_Output
}
