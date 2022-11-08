// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "OpenSearch Documentation": "https://opensearch.org/docs/latest/api-reference/index-apis/put-mapping/"
)

@idempotent
@http(method: "PUT", uri: "/{index}/_mapping")
@suppress(["HttpUriConflict"])
@documentation("The put mapping API operation lets you add new mappings and fields to an index.")
operation PutIndexMappingWithIndex {
    input: PutIndexMappingWithIndexInput,
    output: PutIndexMappingWithIndexOutput
}
