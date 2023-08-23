// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/point-in-time-api/#list-all-pits"
)

@xOperationGroup("get_all_pits")
@xVersionAdded("2.4")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_search/point_in_time/_all")
@documentation("Lists all active point in time searches.")
operation GetAllPits {
    input: GetAllPits_Input,
    output: GetAllPits_Output
}
