// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/ingest-apis/create-update-ingest/"
)

@vendorExtensions(
    "x-operation-group": "ingest.put_pipeline",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_ingest/pipeline/{id}")
@documentation("Creates or updates a pipeline.")
operation IngestPutPipeline {
    input: IngestPutPipeline_Input,
    output: IngestPutPipeline_Output
}
