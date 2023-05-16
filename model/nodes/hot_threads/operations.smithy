// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

// TODO: Fill in API Reference URL
@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest"
)

@deprecated
@vendorExtensions(
    "x-operation-group": "nodes.hot_threads",
    "x-version-added": "1.0",
    "x-deprecation-message": "The hot accepts /_cluster/nodes as prefix for backwards compatibility reasons",
    "x-version-deprecated": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/nodes/hot_threads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_DeprecatedDash {
    input: NodesHotThreads_DeprecatedDash_Input,
    output: NodesHotThreads_Output
}

@deprecated
@vendorExtensions(
    "x-operation-group": "nodes.hot_threads",
    "x-version-added": "1.0",
    "x-deprecation-message": "The hot threads API accepts `hotthreads` but only `hot_threads` is documented",
    "x-version-deprecated": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/nodes/hotthreads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_DeprecatedCluster {
    input: NodesHotThreads_DeprecatedCluster_Input,
    output: NodesHotThreads_Output
}

@vendorExtensions(
    "x-operation-group": "nodes.hot_threads",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/hot_threads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads {
    input: NodesHotThreads_Input,
    output: NodesHotThreads_Output
}

@deprecated
@vendorExtensions(
    "x-operation-group": "nodes.hot_threads",
    "x-version-added": "1.0",
    "x-deprecation-message": "The hot threads API accepts `hotthreads` but only `hot_threads` is documented",
    "x-version-deprecated": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/hotthreads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_Deprecated {
    input: NodesHotThreads_Deprecated_Input,
    output: NodesHotThreads_Output
}

@deprecated
@vendorExtensions(
    "x-operation-group": "nodes.hot_threads",
    "x-version-added": "1.0",
    "x-deprecation-message": "The hot accepts /_cluster/nodes as prefix for backwards compatibility reasons",
    "x-version-deprecated": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/nodes/{node_id}/hot_threads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_WithNodeId_DeprecatedDash {
    input: NodesHotThreads_WithNodeId_DeprecatedDash_Input,
    output: NodesHotThreads_Output
}

@deprecated
@vendorExtensions(
    "x-operation-group": "nodes.hot_threads",
    "x-version-added": "1.0",
    "x-deprecation-message": "The hot threads API accepts `hotthreads` but only `hot_threads` is documented",
    "x-version-deprecated": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/nodes/{node_id}/hotthreads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_WithNodeId_DeprecatedCluster {
    input: NodesHotThreads_WithNodeId_DeprecatedCluster_Input,
    output: NodesHotThreads_Output
}

@vendorExtensions(
    "x-operation-group": "nodes.hot_threads",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}/hot_threads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_WithNodeId {
    input: NodesHotThreads_WithNodeId_Input,
    output: NodesHotThreads_Output
}

@deprecated
@vendorExtensions(
    "x-operation-group": "nodes.hot_threads",
    "x-version-added": "1.0",
    "x-deprecation-message": "The hot threads API accepts `hotthreads` but only `hot_threads` is documented",
    "x-version-deprecated": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}/hotthreads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_WithNodeId_Deprecated {
    input: NodesHotThreads_WithNodeId_Deprecated_Input,
    output: NodesHotThreads_Output
}
