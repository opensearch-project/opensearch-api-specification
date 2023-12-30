// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure SearchPipeline{
    version: Integer,
    request_processors: RequestProcessorsList,
    response_processors: ResponseProcessorsList
}

list RequestProcessorsList {
    member: RequestProcessors
}

list ResponseProcessorsList {
    member: RequestProcessors
}


structure RequestProcessors {
    filter_query: FilterQuery,
    neural_query_enricher: NeuralQueryEnricher,
    script: SearchScript
}

structure ResponseProcessors {
    personalize_search_ranking: PersonalizeSearchRanking,
    rename_field: RenameField,
}

structure FilterQuery {
    query: UserDefinedObjectStructure,
    tag: String,
    description: String,
    ignore_failure: Boolean
}

structure NeuralQueryEnricher {
    default_model_id: String,
    neural_field_default_id: NeuralFieldMap
    tag: String,
    description: String,
}

structure SearchScript {
    source: String,
    lang: String,
    tag: String,
    description: String,
    ignore_failure: Boolean
}

structure PersonalizeSearchRanking {
    campaign_arn: String,
    recipe: String,
    weight: Float,
    item_id_field: String,
    iam_role_arn: String,
    tag: String,
    description: String,
    ignore_failure: Boolean
}

structure RenameField {
    field: String,
    target_field: String,
    tag: String,
    description: String,
    ignore_failure: Boolean
}

map NeuralFieldMap {
  key: String,
  value: String
}
