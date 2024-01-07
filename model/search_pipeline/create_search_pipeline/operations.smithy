// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/search-pipelines/creating-search-pipeline/"
)

@xOperationGroup("search_pipeline.create_search_pipeline")
@xVersionAdded("2.9")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_search/pipeline/{pipeline}")
@documentation("Creates or replaces the specified search pipeline.")
operation CreateSearchPipeline {
    input: CreateSearchPipeline_Input,
    output: CreateSearchPipeline_Output
}
