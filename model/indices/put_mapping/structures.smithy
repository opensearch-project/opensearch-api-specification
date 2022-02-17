namespace OpenSearch

//TODO: remove the redundant code in PutIndexMappingWithIndexInput and PutIndexMappingWithInput by using mixins when introduced in Smithy
structure PutIndexMappingWithIndexInput {
    @httpLabel
    @required
    index: IndexName,

    // Common options to be removed by mixins start
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
    // Common options end

}

structure PutIndexMappingInput {

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

}

structure PutIndexMappingOutput {
    acknowledged: Boolean
}
