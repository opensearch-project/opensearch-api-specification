// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

map SearchPipelineMap {
    key: String
    value: SearchPipelineStructure
}

structure SearchPipelineStructure {
    version: Integer
    request_processors: RequestProcessorList
    response_processors: ResponseProcessorList
    phase_results_processors: PhaseResultsProcessorList
}

// === Common Properties ===

@mixin
structure ProcessorBase {
    tag: String
    description: String
}

@mixin
structure IgnoreableProcessorBase with [ProcessorBase] {
    ignore_failure: Boolean
}

// === Request Processors ===

list RequestProcessorList {
    member: RequestProcessor
}

union RequestProcessor {
    filter_query: FilterQueryRequestProcessor
    neural_query_enricher: NeuralQueryEnricherRequestProcessor
    script: SearchScriptRequestProcessor
    oversample: OversampleRequestProcessor
}

structure FilterQueryRequestProcessor with [IgnoreableProcessorBase] {
    query: UserDefinedObjectStructure
}

structure NeuralQueryEnricherRequestProcessor with [ProcessorBase] {
    default_model_id: String
    neural_field_default_id: NeuralFieldMap
}

map NeuralFieldMap {
    key: String
    value: String
}

structure SearchScriptRequestProcessor with [IgnoreableProcessorBase] {
    @required
    source: String

    lang: String
}

structure OversampleRequestProcessor with [IgnoreableProcessorBase] {
    @required
    sample_factor: Float

    content_prefix: String
}

// === Response Processors ===

list ResponseProcessorList {
    member: RequestProcessor
}

union ResponseProcessor {
    personalize_search_ranking: PersonalizeSearchRankingResponseProcessor
    retrieval_augmented_generation: RetrievalAugmentedGenerationResponseProcessor
    rename_field: RenameFieldResponseProcessor
    rerank: RerankResponseProcessor
    collapse: CollapseResponseProcessor
    truncate_hits: TruncateHitsResponseProcessor
}

structure PersonalizeSearchRankingResponseProcessor with [IgnoreableProcessorBase] {
    @required
    campaign_arn: String

    @required
    recipe: String

    @required
    weight: Float

    item_id_field: String

    iam_role_arn: String
}

structure RetrievalAugmentedGenerationResponseProcessor with [ProcessorBase] {
    @required
    model_id: String

    @required
    context_field_list: ContextFieldList

    system_prompt: String

    user_instructions: String
}

list ContextFieldList {
    member: String
}

structure RenameFieldResponseProcessor with [IgnoreableProcessorBase] {
    @required
    field: String

    @required
    target_field: String
}

structure RerankResponseProcessor with [IgnoreableProcessorBase] {
    ml_opensearch: MLOpenSearchReranker
    context: RerankContext
}

structure MLOpenSearchReranker {
    @required
    model_id: String
}

structure RerankContext {
    @required
    document_fields: DocumentFieldList
}

list DocumentFieldList {
    member: String
}

structure CollapseResponseProcessor with [IgnoreableProcessorBase] {
    @required
    field: String

    context_prefix: String
}

structure TruncateHitsResponseProcessor with [IgnoreableProcessorBase] {
    target_size: Integer
    context_prefix: String
}

// === Phase Results Processors ===

list PhaseResultsProcessorList {
    member: PhaseResultsProcessor
}

union PhaseResultsProcessor {
    @jsonName("normalization-processor")
    normalization_processor: NormalizationPhaseResultsProcessor
}

structure NormalizationPhaseResultsProcessor with [IgnoreableProcessorBase] {
    normalization: ScoreNormalization
    combination: ScoreCombination
}

structure ScoreNormalization {
    technique: ScoreNormalizationTechnique
}

enum ScoreNormalizationTechnique {
    MIN_MAX = "min_max"
    L2 = "l2"
}

structure ScoreCombination {
    technique: ScoreCombinationTechnique
    parameters: ScoreWeights
}

enum ScoreCombinationTechnique {
    ARITHMETIC_MEAN = "arithmetic_mean"
    GEOMETRIC_MEAN = "geometric_mean"
    HARMONIC_MEAN = "harmonic_mean"
}

structure ScoreCombinationParameters {
    weights: ScoreWeights
}

list ScoreWeights {
    member: Float
}
