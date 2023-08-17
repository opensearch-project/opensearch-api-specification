// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@xOperationGroup("ingest.processor_grok")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_ingest/processor/grok")
@documentation("Returns a list of the built-in patterns.")
operation IngestProcessorGrok {
    input: IngestProcessorGrok_Input,
    output: IngestProcessorGrok_Output
}
