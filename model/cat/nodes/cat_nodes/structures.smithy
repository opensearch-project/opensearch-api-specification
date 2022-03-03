namespace OpenSearch


structure GetCatNodesInput {

    // Common options to be removed by mixins start

    @httpQuery("bytes")
    bytes: Byte,

    @httpQuery("full_id")
    full_id: String,

    // Common options end

}

structure GetCatNodesOutput {

    @required
    body: Document,

}
