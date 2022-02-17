namespace OpenSearch

structure PutCreateIndexInput {
    @httpLabel
    @required
    index: IndexName,

    @httpQuery("include_type_name")
    include_type_name: Boolean,

    @httpQuery("wait_for_active_shards")
    wait_for_active_shards: String,

    @httpQuery("master_timeout")
    master_timeout: Time,

    @httpQuery("timeout")
    timeout: Time,

    //TODO: Placeholders. aliases, mapping and settings need to be updated with proper structures

    aliases: UserDefinedValueMap,

    mapping: UserDefinedValueMap,

    settings: UserDefinedValueMap

}

structure PutCreateIndexOutput {

    @required
    Index: IndexName,

    @required
    shards_acknowledged: Boolean,

    acknowledged:Boolean
}