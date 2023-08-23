// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/ingest-apis/delete-ingest/"
)

@xOperationGroup("ingest.delete_pipeline")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_ingest/pipeline/{id}")
@documentation("Deletes a pipeline.")
operation IngestDeletePipeline {
    input: IngestDeletePipeline_Input,
    output: IngestDeletePipeline_Output
}
