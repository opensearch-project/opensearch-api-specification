// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

use aws.protocols#restJson1

@externalDocumentation(
    "OpenSearch Documentation": "https://opensearch.org/docs/latest/"
)

@httpBasicAuth
@restJson1
service OpenSearch {
    version: "2021-11-23",
    operations: [
        IndicesCreate,
        IndicesPutMapping_Put,
        IndicesPutMapping_Post,
        CatIndices,
        CatIndices_WithIndex,
        CatNodes,
        Search_Get,
        Search_Post,
        Search_Get_WithIndex,
        Search_Post_WithIndex,
        IndicesDelete,
        Get,
        GetSource,
        Info,
        ClusterPutSettings,
        ClusterGetSettings,
        IndicesUpdateAliases,
        IndicesGetSettings,
        IndicesGetSettings_WithIndex,
        IndicesGetSettings_WithName,
        IndicesGetSettings_WithIndexName,
        RemoteStoreRestore
    ]
}
