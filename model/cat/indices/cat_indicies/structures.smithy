namespace OpenSearch


structure GetCatIndicesInput {
    // Common options to be removed by mixins start

    @httpQuery("bytes")
    bytes: Byte,

    @httpQuery("expand_wildcards")
    expand_wildcards: ExpandWildcards,

    @httpQuery("health")
    health: HealthStatus,

    @httpQuery("include_unloaded_segments")
    include_unloaded_segments: Boolean,

    @httpQuery("pri")
    pri: Boolean,
    // Common options end

}

structure GetCatIndicesOutput {

   @required
   body:Document

}

structure GetCatIndicesWithIndexInput {
    @httpLabel
    @required
    index: IndexName,

    // Common options to be removed by mixins start

    @httpQuery("bytes")
    bytes: Byte,

    @httpQuery("expand_wildcards")
    expand_wildcards: ExpandWildcards,

    @httpQuery("health")
    health: HealthStatus,

    @httpQuery("include_unloaded_segments")
    include_unloaded_segments: Boolean,

    @httpQuery("pri")
    pri: Boolean,
    // Common options end

}


structure GetCatIndicesWithIndexOutput {

   @required
   body:Document

}

