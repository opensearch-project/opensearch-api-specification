// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/reload-search-analyzer/"
)

@vendorExtensions(
    "x-operation-group": "indices.reload_search_analyzer",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_reload_search_analyzers")
@documentation("Detects any changes to synonym files for any configured search analyzers.")
operation ReloadSearchAnalyzer_Get {
    input: ReloadSearchAnalyzer_Get_Input,
    output: ReloadSearchAnalyzer_Get_Output
}

@vendorExtensions(
    "x-operation-group": "indices.reload_search_analyzer",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "POST", uri: "/{index}/_reload_search_analyzers")
@documentation("Detects any changes to synonym files for any configured search analyzers.")
operation ReloadSearchAnalyzer_Post {
    input: ReloadSearchAnalyzer_Post_Input,
    output: ReloadSearchAnalyzer_Post_Output
}
