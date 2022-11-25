// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure PutCreateIndexInput {
    @httpLabel
    @required
    index: IndexName,

    @httpQuery("include_type_name")
    include_type_name: Boolean,

    @httpQuery("wait_for_active_shards")
    wait_for_active_shards: String,

    @deprecated(since: "2.0.0", message: "To promote inclusive language, use 'cluster_manager_timeout' instead.")
    @httpQuery("master_timeout")
    master_timeout: Time,

    @httpQuery("cluster_manager_timeout")
    cluster_manager_timeout: Time,

    @httpQuery("timeout")
    timeout: Time,

    //TODO: Placeholders. aliases, mapping and settings need to be updated with proper structures

    aliases: UserDefinedValueMap,

    mapping: UserDefinedValueMap,

    settings: UserDefinedValueMap

}

structure PutCreateIndexOutput {

    @required
    index: IndexName,

    @required
    shards_acknowledged: Boolean,

    @required
    acknowledged:Boolean
}

apply PutCreateIndex @examples([
    {
        title: "Examples for Create Index Operation.",
        input: {
            index: "books"
        },
        output: {
            index: "books",
            shards_acknowledged: true,
            acknowledged: true
        }
    }
])
