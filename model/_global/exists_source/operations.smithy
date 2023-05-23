// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@vendorExtensions(
    "x-operation-group": "exists_source",
    "x-version-added": "1.0",
)
@suppress(["HttpUriConflict"])
@http(method: "HEAD", uri: "/{index}/_source/{id}")
@documentation("Returns information about whether a document source exists in an index.")
operation ExistsSource {
    input: ExistsSource_Input,
    output: ExistsSource_Output
}
