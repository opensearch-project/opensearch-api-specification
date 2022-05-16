// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

//TODO: remove the redundant code in PutIndexMappingWithIndexInput and PutIndexMappingWithInput by using mixins when introduced in Smithy
structure PutIndexMappingWithIndexInput {
    @httpLabel
    @required
    index: IndexName,

    // PutIndexMappingInputCommonParameters Start
    @httpQuery("allow_no_indices")
    allow_no_indices: Boolean,

    @httpQuery("expand_wildcards")
    expand_wildcards: ExpandWildcards,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: Boolean,

    @httpQuery("include_type_name")
    include_type_name: Boolean,

    @httpQuery("master_timeout")
    master_timeout: Time,

    @httpQuery("timeout")
    timeout: Time,

    @httpQuery("write_index_only")
    write_index_only: Boolean,

    properties: Document
    // PutIndexMappingInputCommonParameters End

}

structure PutIndexMappingInput {

    // PutIndexMappingInputCommonParameters Start
    @httpQuery("allow_no_indices")
    allow_no_indices: Boolean,

    @httpQuery("expand_wildcards")
    expand_wildcards: ExpandWildcards,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: Boolean,

    @httpQuery("include_type_name")
    include_type_name: Boolean,

    @httpQuery("master_timeout")
    master_timeout: Time,

    @httpQuery("timeout")
    timeout: Time,

    @httpQuery("write_index_only")
    write_index_only: Boolean,

    properties: Document
    // PutIndexMappingInputCommonParameters End

}

structure PutIndexMappingOutput {
    acknowledged: Boolean
}

apply PutIndexMappingWithIndex @examples([
    {
        title: "Examples for Put Index Mapping with index Operation.",
        input: {
            index: "books",
        },
        output: {
            acknowledged: true
        }
    }
])
