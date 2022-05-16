// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

structure DeleteIndexInput {
    @httpLabel
    @required
    index: IndexName,

    @httpQuery("expand_wildcards")
    expand_wildcards: ExpandWildcards,

    @httpQuery("ignore_unavailable")
    ignore_unavailable: Boolean,

    @httpQuery("master_timeout")
    master_timeout: Time,

    @httpQuery("timeout")
    timeout: Time

}

structure DeleteIndexOutput {

    acknowledged:Boolean
}

apply DeleteIndex @examples([
    {
        title: "Examples for Delete Index Operation.",
        input: {
            index: "books"
        },
        output: {
            acknowledged: true
        }
    }
])
