// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/point-in-time-api/#create-a-pit"
)

@xOperationGroup("create_pit")
@xVersionAdded("2.4")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_search/point_in_time")
@documentation("Creates point in time context.")
operation CreatePit {
    input: CreatePit_Input,
    output: CreatePit_Output
}
