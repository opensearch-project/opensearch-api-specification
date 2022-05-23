// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

structure PostAliasesInput {


    @httpQuery("master_timeout")
    master_timeout: Time,

    @httpQuery("timeout")
    timeout: Time,

   // Request-body parameters 

    actions: UserDefinedObjectStructureAction

}

structure UserDefinedObjectStructureAction {

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

structure PostAliasesOutput {

    @required
    acknowledged:Boolean

}


apply PostAliases @examples([
    {
        title: "Examples for Post Aliases Operation.",
        output:{
            acknowledged: true
        }
    }
])
