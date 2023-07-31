// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/ingest-apis/simulate-ingest/"
)

@vendorExtensions(
    "x-operation-group": "ingest.simulate",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_ingest/pipeline/_simulate")
@documentation("Allows to simulate a pipeline with example documents.")
operation IngestSimulate_Get {
    input: IngestSimulate_Get_Input,
    output: IngestSimulate_Output
}

@vendorExtensions(
    "x-operation-group": "ingest.simulate",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_ingest/pipeline/_simulate")
@documentation("Allows to simulate a pipeline with example documents.")
operation IngestSimulate_Post {
    input: IngestSimulate_Post_Input,
    output: IngestSimulate_Output
}

@vendorExtensions(
    "x-operation-group": "ingest.simulate",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_ingest/pipeline/{id}/_simulate")
@documentation("Allows to simulate a pipeline with example documents.")
operation IngestSimulate_Get_WithId {
    input: IngestSimulate_Get_WithId_Input,
    output: IngestSimulate_Output
}

@vendorExtensions(
    "x-operation-group": "ingest.simulate",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_ingest/pipeline/{id}/_simulate")
@documentation("Allows to simulate a pipeline with example documents.")
operation IngestSimulate_Post_WithId {
    input: IngestSimulate_Post_WithId_Input,
    output: IngestSimulate_Output
}
