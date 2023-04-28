// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure NodesHotThreads_QueryParams {
    @httpQuery("interval")
    interval: Interval,

    @httpQuery("snapshots")
    @default(10)
    snapshots: SnapshotsCount,

    @httpQuery("threads")
    @default(3)
    threads: Threads,

    @httpQuery("ignore_idle_threads")
    @default(true)
    ignore_idle_threads: IgnoreIdleThreads,

    @httpQuery("type")
    @default("cpu")
    type: SampleType,

    @httpQuery("timeout")
    timeout: Timeout,
}


@input
structure NodesHotThreads_Input with [NodesHotThreads_QueryParams] {
}

@input
structure NodesHotThreads_WithNodeId_Input with [NodesHotThreads_QueryParams] {
    @required
    @httpLabel
    node_id: PathNodeId,
}

@input
structure NodesHotThreads_Input with [NodesHotThreads_QueryParams] {
}

@input
structure NodesHotThreads_WithNodeId_Input with [NodesHotThreads_QueryParams] {
    @required
    @httpLabel
    node_id: PathNodeId,
}

@input
structure NodesHotThreads_Input with [NodesHotThreads_QueryParams] {
}

@input
structure NodesHotThreads_WithNodeId_Input with [NodesHotThreads_QueryParams] {
    @required
    @httpLabel
    node_id: PathNodeId,
}

@input
structure NodesHotThreads_Input with [NodesHotThreads_QueryParams] {
}

@input
structure NodesHotThreads_WithNodeId_Input with [NodesHotThreads_QueryParams] {
    @required
    @httpLabel
    node_id: PathNodeId,
}

// TODO: Fill in Output Structure
structure NodesHotThreads_Output {}
