// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

map SearchPipelineMap{
    key: String,
    value: SearchPipelineStructure
}

structure SearchPipelineStructure{
    version: Integer,
    request_processors: RequestProcessorsList,
    response_processors: ResponseProcessorsList,
    phase_results_processors: PhaseResultsProcessorsList
}

list RequestProcessorsList {
    member: RequestProcessors
}

list ResponseProcessorsList {
    member: RequestProcessors
}

list PhaseResultsProcessorsList {
    member: PhaseResultsProcessors
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

structure PhaseResultsProcessors {
    normalization: ScoreNormalization,
    combination: ScoreCombination,
    tag: String,
    description: String,
    ignore_failure: Boolean
}

structure ScoreNormalization{
    technique: String
}

structure ScoreCombination{
    technique: String,
    parameters: ScoreWeights
}

list ScoreWeights{
    member: Float
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
