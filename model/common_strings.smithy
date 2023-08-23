// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of alias names.")
string PathAliasNames

@xDataType("array")
@xEnumOptions(["_all", "blocks", "metadata", "nodes", "routing_table", "routing_nodes", "master_node", "cluster_manager_node", "version"])
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Limit the information returned to the specified metrics.")
string PathClusterStateMetric

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("The Comma-separated names of the component templates.")
string PathComponentTemplateNames

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
string PathFields

@xDataType("array")
@xEnumOptions(["_all", "completion", "docs", "fielddata", "query_cache", "flush", "get", "indexing", "merge", "request_cache", "refresh", "search", "segments", "store", "warmer", "suggest"])
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Limit the information returned for `indices` metric to the specific index metrics. Isn't used if `indices` (or `all`) metric isn't specified.")
string PathIndexMetric

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of names or wildcard expressions.")
string PathIndexNames

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of indices; use `_all` or empty string to perform the operation on all indices.")
string PathIndices

@xDataType("array")
@xEnumOptions(["_all", "completion", "docs", "fielddata", "query_cache", "flush", "get", "indexing", "merge", "request_cache", "refresh", "search", "segments", "store", "warmer", "suggest"])
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Limit the information returned the specific metrics.")
string PathIndicesStatsMetric

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of aliases to delete (supports wildcards); use `_all` to delete all aliases for the specified indices.")
string PathName

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of node IDs or names to limit the returned information; use `_local` to return information from the node you're connecting to, leave empty to get information from all nodes.")
string PathNodeId

@xDataType("array")
@xEnumOptions(["settings", "os", "process", "jvm", "thread_pool", "transport", "http", "plugins", "ingest"])
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of metrics you wish returned. Leave empty to return all.")
string PathNodesInfoMetric

@xDataType("array")
@xEnumOptions(["_all", "breaker", "fs", "http", "indices", "jvm", "os", "process", "thread_pool", "transport", "discovery", "indexing_pressure"])
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Limit the information returned to the specified metrics.")
string PathNodesStatsMetric

@xDataType("array")
@xEnumOptions(["_all", "rest_actions"])
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Limit the information returned to the specified metrics.")
string PathNodesUsageMetric

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of pipeline ids. Wildcards supported.")
string PathPipelineIds

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of repository names.")
string PathRepositories

@deprecated
@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of scroll IDs to clear.")
string PathScrollIds

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of settings.")
string PathSettingNames

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of snapshot names.")
string PathSnapshots

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of data streams; use `_all` or empty string to perform the operation on all data streams.")
string PathStreamNames

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated names of the index templates.")
string PathTemplateNames

@xDataType("array")
@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Comma-separated list of regular-expressions to filter the thread pools in the output.")
string PathThreadPoolPatterns

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("The name of the alias to rollover.")
string PathAlias

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("The name of the alias to be created or updated.")
string PathAliasName

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Awareness attribute name.")
string PathAttribute

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Awareness attribute name.")
string PathAwarenessAttributeName

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Awareness attribute value.")
string PathAwarenessAttributeValue

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("The block to add (one of read, write, read_only or metadata).")
string PathBlock

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Script context.")
string PathContext

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Document ID.")
string PathDocumentId

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Index name.")
string PathIndex

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("The name of the index (it must be a concrete index name).")
string PathIndexName

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("The UUID of the dangling index.")
string PathIndexUuid

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("The name of the rollover index.")
string PathNewIndex

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Pipeline ID.")
string PathPipelineId

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Repository name.")
string PathRepository

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Script ID.")
string PathScriptId

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Scroll ID.")
string PathScrollId

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("The id of the stored search template.")
string PathSearchTemplateId

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("Snapshot name.")
string PathSnapshot

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("The name of the data stream.")
string PathStreamName

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("The name of the target index.")
string PathTarget

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("The name of the cloned snapshot to create.")
string PathTargetSnapshot

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
string PathTaskId

@pattern("^(?!_|template|query|field|point|clear|usage|stats|hot|reload|painless).+$")
@documentation("The name of the template.")
string PathTemplateName

@documentation("The analyzer to use for the query string.")
string Analyzer

@documentation("The awareness attribute for which the health is required.")
string AwarenessAttribute

@documentation("User defined reason for dry-run creating the new template for simulation purposes.")
string Cause

@documentation("The field to use as default where no field prefix is given in the query string.")
string Df

@documentation("The default field for query string query.")
string DfExplain

@documentation("Default document type for items which don't provide one.")
string DocumentType

@documentation("A short version of the Accept header, e.g. json, yaml.")
string Format

string Index

@documentation("Specify the keep alive for point in time.")
string KeepAlive

@documentation("The script language.")
string Lang

@documentation("Comma-separated list of the persistent ids of the nodes to exclude from the voting configuration. If specified, you may not also specify ?node_names.")
string NodeIds

@documentation("Comma-separated list of the names of the nodes to exclude from the voting configuration. If specified, you may not also specify ?node_ids.")
string NodeNames

string ParentTaskId

@documentation("The pipeline id to preprocess incoming documents with.")
string Pipeline

@documentation("Specify the node or shard the operation should be performed on.")
string Preference

@documentation("Query in the Lucene query string syntax.")
string Q

@documentation("Routing value.")
string Routing

@documentation("Scroll ID.")
string ScrollId

@documentation("The number of slices this task should be divided into. Defaults to 1, meaning the task isn't sliced into subtasks. Can be set to `auto`.")
string Slices

@documentation("Specify which field to use for suggestions.")
string SuggestField

@documentation("The source text for which the suggestions should be returned.")
string SuggestText

string WaitForActiveShards

@documentation("Wait until the specified number of nodes is available.")
string WaitForNodes

@xDataType("time")
@pattern("^([0-9]+)(?:d|h|m|s|ms|micros|nanos)$")
@documentation("Time each individual bulk request should wait for shards that are unavailable.")
string BulkTimeout

@xDataType("time")
@xVersionAdded("2.0.0")
@pattern("^([0-9]+)(?:d|h|m|s|ms|micros|nanos)$")
@documentation("Operation timeout for connection to cluster-manager node.")
string ClusterManagerTimeout

@xDataType("time")
@pattern("^([0-9]+)(?:d|h|m|s|ms|micros|nanos)$")
@documentation("The interval for the second sampling of threads.")
string Interval

@deprecated
@xDataType("time")
@xDeprecationMessage("To promote inclusive language, use 'cluster_manager_timeout' instead.")
@xVersionDeprecated("2.0.0")
@pattern("^([0-9]+)(?:d|h|m|s|ms|micros|nanos)$")
@documentation("Operation timeout for connection to master node.")
string MasterTimeout

@xDataType("time")
@pattern("^([0-9]+)(?:d|h|m|s|ms|micros|nanos)$")
@documentation("Specify how long a consistent view of the index should be maintained for scrolled search.")
string Scroll

@xDataType("time")
@pattern("^([0-9]+)(?:d|h|m|s|ms|micros|nanos)$")
@documentation("Explicit timeout for each search request. Defaults to no timeout.")
string SearchTimeout

@xDataType("time")
@pattern("^([0-9]+)(?:d|h|m|s|ms|micros|nanos)$")
@documentation("Operation timeout.")
string Timeout

@xDataType("time")
@pattern("^([0-9]+)(?:d|h|m|s|ms|micros|nanos)$")
@documentation("The maximum time to wait for wait_for_metadata_version before timing out.")
string WaitForTimeout
