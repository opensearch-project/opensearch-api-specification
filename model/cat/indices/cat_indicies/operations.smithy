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
@documentation("Returns information about indices: number of primaries and replicas, document counts, disk size, etc.")
operation GetCatIndices {
    input: GetCatIndicesInput,
    output: GetCatIndicesOutput
}


@readonly
@http(method: "GET", uri: "/_cat/indices/{index}")
@suppress(["HttpUriConflict"])
@documentation("Returns information about indices: number of primaries and replicas, document counts, disk size, etc.")
operation GetCatIndicesWithIndex {
    input: GetCatIndicesWithIndexInput,
    output: GetCatIndicesWithIndexOutput
}
