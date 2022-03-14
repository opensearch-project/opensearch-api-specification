// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

@externalDocumentation(
    "OpenSearch Documentation": "https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-nodes/"
)

@readonly
@http(method: "GET", uri: "/_cat/nodes")
@suppress(["HttpUriConflict"])
@documentation("Returns basic statistics about performance of cluster nodes.")
operation GetCatNodes {
    input: GetCatNodesInput,
    output: GetCatNodesOutput,
}
