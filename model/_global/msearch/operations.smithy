// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/multi-search/"
)

@xOperationGroup("msearch")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_msearch")
@documentation("Allows to execute several search operations in one request.")
operation Msearch_Get {
    input: Msearch_Get_Input,
    output: Msearch_Output
}

@xOperationGroup("msearch")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_msearch")
@documentation("Allows to execute several search operations in one request.")
operation Msearch_Post {
    input: Msearch_Post_Input,
    output: Msearch_Output
}

@xOperationGroup("msearch")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_msearch")
@documentation("Allows to execute several search operations in one request.")
operation Msearch_Get_WithIndex {
    input: Msearch_Get_WithIndex_Input,
    output: Msearch_Output
}

@xOperationGroup("msearch")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_msearch")
@documentation("Allows to execute several search operations in one request.")
operation Msearch_Post_WithIndex {
    input: Msearch_Post_WithIndex_Input,
    output: Msearch_Output
}
