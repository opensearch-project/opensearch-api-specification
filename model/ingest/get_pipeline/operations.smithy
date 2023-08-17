// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/ingest-apis/get-ingest/"
)

@xOperationGroup("ingest.get_pipeline")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_ingest/pipeline")
@documentation("Returns a pipeline.")
operation IngestGetPipeline {
    input: IngestGetPipeline_Input,
    output: IngestGetPipeline_Output
}

@xOperationGroup("ingest.get_pipeline")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_ingest/pipeline/{id}")
@documentation("Returns a pipeline.")
operation IngestGetPipeline_WithId {
    input: IngestGetPipeline_WithId_Input,
    output: IngestGetPipeline_Output
}
