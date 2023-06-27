// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-segment-replication/"
)

@vendorExtensions(
    "x-operation-group": "cat.segment_replication",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/segment_replication")
@documentation("Returns information about both on-going and latest completed Segment Replication events.")
operation CatSegmentReplication {
    input: CatSegmentReplication_Input,
    output: CatSegmentReplication_Output
}

@vendorExtensions(
    "x-operation-group": "cat.segment_replication",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/segment_replication/{index}")
@documentation("Returns information about both on-going and latest completed Segment Replication events.")
operation CatSegmentReplication_WithIndex {
    input: CatSegmentReplication_WithIndex_Input,
    output: CatSegmentReplication_Output
}
