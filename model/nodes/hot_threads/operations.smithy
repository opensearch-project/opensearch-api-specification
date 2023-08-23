// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/nodes-apis/nodes-hot-threads/"
)

@deprecated
@xOperationGroup("nodes.hot_threads")
@xVersionAdded("1.0")
@xDeprecationMessage("The hot accepts /_cluster/nodes as prefix for backwards compatibility reasons")
@xVersionDeprecated("1.0")
@xIgnorable(true)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/nodes/hot_threads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_DeprecatedDash {
    input: NodesHotThreads_DeprecatedDash_Input,
    output: NodesHotThreads_Output
}

@deprecated
@xOperationGroup("nodes.hot_threads")
@xVersionAdded("1.0")
@xDeprecationMessage("The hot threads API accepts `hotthreads` but only `hot_threads` is documented")
@xVersionDeprecated("1.0")
@xIgnorable(true)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/nodes/hotthreads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_DeprecatedCluster {
    input: NodesHotThreads_DeprecatedCluster_Input,
    output: NodesHotThreads_Output
}

@xOperationGroup("nodes.hot_threads")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/hot_threads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads {
    input: NodesHotThreads_Input,
    output: NodesHotThreads_Output
}

@deprecated
@xOperationGroup("nodes.hot_threads")
@xVersionAdded("1.0")
@xDeprecationMessage("The hot threads API accepts `hotthreads` but only `hot_threads` is documented")
@xVersionDeprecated("1.0")
@xIgnorable(true)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/hotthreads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_Deprecated {
    input: NodesHotThreads_Deprecated_Input,
    output: NodesHotThreads_Output
}

@deprecated
@xOperationGroup("nodes.hot_threads")
@xVersionAdded("1.0")
@xDeprecationMessage("The hot accepts /_cluster/nodes as prefix for backwards compatibility reasons")
@xVersionDeprecated("1.0")
@xIgnorable(true)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/nodes/{node_id}/hot_threads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_WithNodeId_DeprecatedDash {
    input: NodesHotThreads_WithNodeId_DeprecatedDash_Input,
    output: NodesHotThreads_Output
}

@deprecated
@xOperationGroup("nodes.hot_threads")
@xVersionAdded("1.0")
@xDeprecationMessage("The hot threads API accepts `hotthreads` but only `hot_threads` is documented")
@xVersionDeprecated("1.0")
@xIgnorable(true)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cluster/nodes/{node_id}/hotthreads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_WithNodeId_DeprecatedCluster {
    input: NodesHotThreads_WithNodeId_DeprecatedCluster_Input,
    output: NodesHotThreads_Output
}

@xOperationGroup("nodes.hot_threads")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}/hot_threads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_WithNodeId {
    input: NodesHotThreads_WithNodeId_Input,
    output: NodesHotThreads_Output
}

@deprecated
@xOperationGroup("nodes.hot_threads")
@xVersionAdded("1.0")
@xDeprecationMessage("The hot threads API accepts `hotthreads` but only `hot_threads` is documented")
@xVersionDeprecated("1.0")
@xIgnorable(true)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_nodes/{node_id}/hotthreads")
@documentation("Returns information about hot threads on each node in the cluster.")
operation NodesHotThreads_WithNodeId_Deprecated {
    input: NodesHotThreads_WithNodeId_Deprecated_Input,
    output: NodesHotThreads_Output
}
