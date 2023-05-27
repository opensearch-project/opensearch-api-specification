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
    "x-operation-group": "delete_all_pits",
    "x-version-added": "1.0",
)
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_search/point_in_time/_all")
@documentation("Deletes all active point in time searches.")
operation DeleteAllPits {
    input: DeleteAllPits_Input,
    output: DeleteAllPits_Output
}
