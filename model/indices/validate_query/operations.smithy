// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@xOperationGroup("indices.validate_query")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_validate/query")
@documentation("Allows a user to validate a potentially expensive query without executing it.")
operation IndicesValidateQuery_Get {
    input: IndicesValidateQuery_Get_Input,
    output: IndicesValidateQuery_Output
}

@xOperationGroup("indices.validate_query")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_validate/query")
@documentation("Allows a user to validate a potentially expensive query without executing it.")
operation IndicesValidateQuery_Post {
    input: IndicesValidateQuery_Post_Input,
    output: IndicesValidateQuery_Output
}

@xOperationGroup("indices.validate_query")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_validate/query")
@documentation("Allows a user to validate a potentially expensive query without executing it.")
operation IndicesValidateQuery_Get_WithIndex {
    input: IndicesValidateQuery_Get_WithIndex_Input,
    output: IndicesValidateQuery_Output
}

@xOperationGroup("indices.validate_query")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_validate/query")
@documentation("Allows a user to validate a potentially expensive query without executing it.")
operation IndicesValidateQuery_Post_WithIndex {
    input: IndicesValidateQuery_Post_WithIndex_Input,
    output: IndicesValidateQuery_Output
}
