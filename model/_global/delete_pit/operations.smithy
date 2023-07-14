// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/point-in-time-api/#delete-pits"
)

@vendorExtensions(
    "x-operation-group": "delete_pit",
    "x-version-added": "2.4",
)
@idempotent
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "DELETE", uri: "/_search/point_in_time")
@documentation("Deletes one or more point in time searches based on the IDs passed.")
operation DeletePit {
    input: DeletePit_Input,
    output: DeletePit_Output
}
