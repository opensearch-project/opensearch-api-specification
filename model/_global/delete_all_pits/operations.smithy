// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/point-in-time-api/#delete-pits"
)

@xOperationGroup("delete_all_pits")
@xVersionAdded("2.4")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "DELETE", uri: "/_search/point_in_time/_all")
@documentation("Deletes all active point in time searches.")
operation DeleteAllPits {
    input: DeleteAllPits_Input,
    output: DeleteAllPits_Output
}
