// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/search-plugins/knn/api/#stats"
)

@xOperationGroup("knn.stats")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_knn/stats")
@documentation("Provides information about the current status of the k-NN plugin.")
operation KNNStats {
    input: KNNStats_Input,
    output: KNNStats_Output
}

@xOperationGroup("knn.stats")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_knn/{nodeId}/stats")
@documentation("Provides information about the current status of the k-NN plugin.")
operation KNNStats_WithNodeId {
    input: KNNStats_WithNodeId_Input,
    output: KNNStats_Output
}

@xOperationGroup("knn.stats")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_knn/stats/{stat}")
@documentation("Provides information about the current status of the k-NN plugin.")
operation KNNStats_WithStat {
    input: KNNStats_WithStat_Input,
    output: KNNStats_Output
}

@xOperationGroup("knn.stats")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_knn/{nodeId}/stats/{stat}")
@documentation("Provides information about the current status of the k-NN plugin.")
operation KNNStats_WithStatNodeId {
    input: KNNStats_WithStatNodeId_Input,
    output: KNNStats_Output
}
