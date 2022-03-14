// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

@externalDocumentation(
    "OpenSearch Documentation": "https://opensearch.org/docs/latest/opensearch/rest-api/index-apis/delete-index/"
)

@http(method: "DELETE", uri: "/{index}")
@suppress(["HttpUriConflict"])
@documentation("Removes a document from the index.")
operation DeleteIndex {
    input: DeleteIndexInput,
    output: DeleteIndexOutput
}

