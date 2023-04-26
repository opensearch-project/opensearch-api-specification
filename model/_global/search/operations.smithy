// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/search/"
)

@vendorExtensions(
    "x-operation-group": "search",
    "x-version-added": "1.0"
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_search")
@documentation("Returns results matching a query.")
operation Search_Get {
    input: Search_Get_Input,
    output: Search_Output
}

@vendorExtensions(
    "x-operation-group": "search",
    "x-version-added": "1.0"
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_search")
@documentation("Returns results matching a query.")
operation Search_Post {
    input: Search_Post_Input,
    output: Search_Output
}

@vendorExtensions(
    "x-operation-group": "search",
    "x-version-added": "1.0"
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_search")
@documentation("Returns results matching a query.")
operation Search_Get_WithIndex {
    input: Search_Get_WithIndex_Input,
    output: Search_Output
}

@vendorExtensions(
    "x-operation-group": "search",
    "x-version-added": "1.0"
)
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_search")
@documentation("Returns results matching a query.")
operation Search_Post_WithIndex {
    input: Search_Post_WithIndex_Input,
    output: Search_Output
}

apply Search_Post @examples([
    {
        title: "Examples for Post Search Operation.",
        input: {
            scroll: "1d",
            content: {
                query: {
                    match_all: {}
                },
                fields: ["*"]
            }
        },
        output: {
            timed_out: false,
            _shards: {
                total: 1,
                successful: 1,
                skipped: 0,
                failed: 0
            },
            hits: {
                total: {
                    value: 0,
                    relation: "eq"
                },
                hits: []
            }
        }
    }
])

apply Search_Post_WithIndex @examples([
    {
        title: "Examples for Post Search With Index Operation.",
        input: {
            index: "books",
            scroll: "1d",
            content: {
                query: {
                    match_all: {}
                },
                fields: ["*"]
            }
        },
        output: {
            timed_out: false,
            _shards: {
                total: 1,
                successful: 1,
                skipped: 0,
                failed: 0
            },
            hits: {
                total: {
                    value: 0,
                    relation: "eq"
                },
                hits: []
            }
        }
    }
])
