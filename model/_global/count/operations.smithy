// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/count/"
)

@xOperationGroup("count")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_count")
@documentation("Returns number of documents matching a query.")
operation Count_Post {
    input: Count_Post_Input,
    output: Count_Output
}

@xOperationGroup("count")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_count")
@documentation("Returns number of documents matching a query.")
operation Count_Get {
    input: Count_Get_Input,
    output: Count_Output
}

@xOperationGroup("count")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_count")
@documentation("Returns number of documents matching a query.")
operation Count_Post_WithIndex {
    input: Count_Post_WithIndex_Input,
    output: Count_Output
}

@xOperationGroup("count")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_count")
@documentation("Returns number of documents matching a query.")
operation Count_Get_WithIndex {
    input: Count_Get_WithIndex_Input,
    output: Count_Output
}
