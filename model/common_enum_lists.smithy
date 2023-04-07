// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@documentation("Limit the information returned to the specified metrics. Defaults to all but metadata.")
list ClusterRerouteMetric {
    member: ClusterRerouteMetric_Member
}

enum ClusterRerouteMetric_Member {
    ALL = "_all"
    BLOCKS = "blocks"
    METADATA = "metadata"
    NODES = "nodes"
    ROUTING_TABLE = "routing_table"
    MASTER_NODE = "master_node"
    CLUSTER_MANAGER_NODE = "cluster_manager_node"
    VERSION = "version"
}

@documentation("Comma-separated list of statuses used to filter on shards to get store information for.")
list Status {
    member: Status_Member
}

enum Status_Member {
    GREEN = "green"
    YELLOW = "yellow"
    RED = "red"
    ALL = "all"
}
