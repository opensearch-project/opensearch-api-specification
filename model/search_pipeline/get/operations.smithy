// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/search-pipelines/index/"
)

@xOperationGroup("search_pipeline.get")
@xVersionAdded("2.9")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_search/pipeline/{pipeline}")
@documentation("Retrieves information about a specified search pipeline.")
operation GetSearchPipeline {
    input: GetSearchPipeline_Input,
    output: GetSearchPipeline_Output
}
