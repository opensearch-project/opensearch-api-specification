// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IndicesUpdateAliases_QueryParams {
    @httpQuery("timeout")
    timeout: Timeout,

    @httpQuery("master_timeout")
    master_timeout: MasterTimeout,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: ClusterManagerTimeout,
}

structure IndicesUpdateAliases_BodyParams {
    actions: ActionObjectStructure
}

structure ActionObjectStructure {

    add: UserDefinedStructure,

    remove: UserDefinedStructure,

    remove_index: UserDefinedStructure

}

structure UserDefinedStructure{

    alias: String,

    aliases: UserDefinedValueList,

    filter: Document,

    index: String,

    indices: UserDefinedValueList,

    index_routing: String,

    is_hidden: Boolean,

    is_write_index: Boolean,

    must_exist: String,

    routing: String,

    search_routing: String

}

@input
structure IndicesUpdateAliases_Input with [IndicesUpdateAliases_QueryParams] {
    @required
    @httpPayload
    content: IndicesUpdateAliases_BodyParams,
}

structure IndicesUpdateAliases_Output {
    @required
    acknowledged:Boolean
}
