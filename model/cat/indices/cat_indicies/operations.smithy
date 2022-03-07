// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

@externalDocumentation(
    "OpenSearch Documentation": "https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-indices/"
)

@readonly
@http(method: "GET", uri: "/_cat/indices")
@suppress(["HttpUriConflict"])
@documentation("The Cat Indicies API operation lets you read high level information about indices.")
operation GetCatIndices {
    input: GetCatIndicesInput,
    output: GetCatIndicesOutput
}


@readonly
@http(method: "GET", uri: "/_cat/indices/{index}")
@suppress(["HttpUriConflict"])
@documentation("The Cat Indicies API operation lets you read high level information about indices with index")
operation GetCatIndicesWithIndex {
    input: GetCatIndicesWithIndexInput,
    output: GetCatIndicesWithIndexOutput
}