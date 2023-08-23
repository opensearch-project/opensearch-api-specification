// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/ingest-apis/create-update-ingest/"
)

@xOperationGroup("ingest.put_pipeline")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_ingest/pipeline/{id}")
@documentation("Creates or updates a pipeline.")
operation IngestPutPipeline {
    input: IngestPutPipeline_Input,
    output: IngestPutPipeline_Output
}
