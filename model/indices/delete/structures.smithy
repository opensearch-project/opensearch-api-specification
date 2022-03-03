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
    timeout: Time,

}

structure DeleteIndexOutput {

    @required
    Index: IndexName,

    acknowledged:Boolean
}