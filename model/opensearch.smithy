// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

use aws.protocols#restJson1

@externalDocumentation(
    "OpenSearch Documentation": "https://opensearch.org/docs/latest/"
)

@restJson1
service OpenSearch {
    version: "2021-11-23",
    operations: [PutCreateIndex, PutIndexMapping, PutIndexMappingWithIndex, GetCatIndices, GetCatIndicesWithIndex, GetCatNodes, PostSearch, PostSearchWithIndex, DeleteIndex, GetDocumentDoc, GetDocumentSource, GetPingCluster, PutUpdateClusterSettings, GetClusterSettings]
}
