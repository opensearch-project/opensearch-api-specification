// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

structure GetDocumentDocInput {
    @httpLabel
    @required
    index: IndexName,

    @httpLabel
    @required
    id: IdName,        

    // Common options to be removed by mixins start
    @httpQuery("preference")
    preference: String,

    @httpQuery("realtime")
    realtime: Boolean,

    @httpQuery("refresh")
    refresh: Boolean,

    @httpQuery("routing")
    routing: String,

    @httpQuery("stored_fields")
    stored_fields: Boolean,

    @httpQuery("_source")
    _source: String,

    @httpQuery("_source_excludes")
    _source_excludes: String,

    @httpQuery("_source_includes")
    _source_includes: String,

    @httpQuery("version")
    version: Integer,

    @httpQuery("version_ype")
    version_type: VersionType
    // Common options end

}


structure GetDocumentDocOutput {

    @required
    Index: IndexName,

    @required
    type: String,

    @required
    id: IdName,           

    version: Integer,

    seq_no: Long,

    primary_term: Long,

    @required
    found: Boolean,

    routing: String,

    source: UserDefinedValueMap,

}



structure GetDocumentSourceInput {
    @httpLabel
    @required
    index: IndexName,

    @httpLabel
    @required
    id: IdName,        

    // Common options to be removed by mixins start
    @httpQuery("preference")
    preference: String,

    @httpQuery("realtime")
    realtime: Boolean,

    @httpQuery("refresh")
    refresh: Boolean,

    @httpQuery("routing")
    routing: String,

    @httpQuery("stored_fields")
    stored_fields: Boolean,

    @httpQuery("_source")
    _source: String,

    @httpQuery("_source_excludes")
    _source_excludes: String,

    @httpQuery("_source_includes")
    _source_includes: String,

    @httpQuery("version")
    version: Integer,

    @httpQuery("version_ype")
    version_type: VersionType
    // Common options end


}


structure GetDocumentSourceOutput {

    @required
    Index: IndexName,

    @required
    type: String,

    @required
    id: IdName,           

    version: Integer,

    seq_no: Long,

    primary_term: Long,

    @required
    found: Boolean,

    routing: String,

    source: UserDefinedValueMap,
    
}