// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

@externalDocumentation(
    "OpenSearch Documentation": "https://opensearch.org/docs/latest/opensearch/rest-api/index-apis/create-index/"
)

@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}")
@documentation("Creates index mappings.")
operation PutCreateIndex {
    input: PutCreateIndexInput,
    output: PutCreateIndexOutput
}
