// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure KNNTrainModel_QueryParams {
    @httpQuery("preference")
    preference: NodeId,
}

structure KNNTrainModel_BodyParams {
    @required
    training_index: String,

    @required
    training_field: String,

    @required
    dimension: Integer,

    max_training_vector_count: Integer,

    search_size: Integer,

    description: String,

    @required
    method: String,
}

@input
structure KNNTrainModel_Input  with [KNNTrainModel_QueryParams] {
    @required
    @httpPayload
    content: KNNTrainModel_BodyParams,
}

@input
structure KNNTrainModel_WithModelId_Input  with [KNNTrainModel_QueryParams] {
    @required
    @httpPayload
    content: KNNTrainModel_BodyParams,

    @required
    @httpLabel
    model_id: PathModelId,
}

// TODO: Fill in Output Structure
structure KNNTrainModel_Output {}
