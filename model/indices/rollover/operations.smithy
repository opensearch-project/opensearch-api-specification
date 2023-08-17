// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/dashboards/im-dashboards/rollover/"
)

@xOperationGroup("indices.rollover")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{alias}/_rollover")
@documentation("Updates an alias to point to a new index when the existing index
is considered to be too large or too old.")
operation IndicesRollover {
    input: IndicesRollover_Input,
    output: IndicesRollover_Output
}

@xOperationGroup("indices.rollover")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{alias}/_rollover/{new_index}")
@documentation("Updates an alias to point to a new index when the existing index
is considered to be too large or too old.")
operation IndicesRollover_WithNewIndex {
    input: IndicesRollover_WithNewIndex_Input,
    output: IndicesRollover_Output
}
