// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

boolean AcceptDataLoss

boolean ActiveOnly

@documentation("Execute validation on all shards instead of one random shard per index.")
boolean AllShards

@documentation("Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified).")
boolean AllowNoIndices

@documentation("Allow if point in time can be created with partial failures.")
boolean AllowPartialPitCreation

@documentation("Indicate if an error should be returned if there is a partial search failure or timeout.")
boolean AllowPartialSearchResults

@documentation("Specify whether wildcard and prefix queries should be analyzed.")
boolean AnalyzeWildcard

@documentation("Indicates whether network round-trips should be minimized as part of cross-cluster search requests execution.")
boolean CcsMinimizeRoundtrips

@documentation("Simulate the operation only and return the resulting state.")
boolean ClusterRerouteDryRun

@documentation("If `true`, the response only includes latest completed segment replication events.")
boolean CompletedOnly

@documentation("whether or not to copy settings from the source index.")
boolean CopySettings

@documentation("Whether the index template should only be added if new or can also replace an existing one.")
boolean Create

boolean Detailed

@documentation("Whether to ignore unavailable snapshots, defaults to false which means a SnapshotMissingException is thrown.")
boolean DfExplainSnapshot

@documentation("Checks whether local node is commissioned or not. If set to true on a local call it will throw exception if node is decommissioned.")
boolean EnsureNodeCommissioned

boolean Explain

@documentation("Specifies if document count, sum of document frequencies and sum of total term frequencies should be returned.")
boolean FieldStatistics

@documentation("Clear field data.")
boolean Fielddata

@documentation("Return settings in flat format.")
boolean FlatSettings

@documentation("Specify whether the index should be flushed after performing the operation.")
boolean Flush

@documentation("If set to false stats will also collected from closed indices if explicitly specified or if expand_wildcards expands to closed indices.")
boolean ForbidClosedIndices

@documentation("Whether a flush should be forced even if it is not necessarily needed ie. if no changes will be committed to the index. This is useful if transaction log IDs should be incremented even if no uncommitted changes are present. (This setting can be considered as internal).")
boolean Force

@documentation("Return the full node ID instead of the shortened version.")
boolean FullId

@documentation("Return help information.")
boolean Help

@documentation("Don't show threads that are in known-idle places, such as waiting on a socket select or pulling from an empty task queue.")
boolean IgnoreIdleThreads

@documentation("Whether specified concrete, expanded or aliased indices should be ignored when throttled.")
boolean IgnoreThrottled

@documentation("Whether specified concrete indices should be ignored when unavailable (missing or closed).")
boolean IgnoreUnavailable

boolean IncludeDefaults

@documentation("Return information about disk usage and shard sizes.")
boolean IncludeDiskInfo

@documentation("Indicates whether hit.matched_queries should be rendered as a map that includes the name of the matched query associated with its score (true) or as an array containing the name of the matched queries (false)")
boolean IncludeNamedQueriesScore

@documentation("Whether to report the aggregated disk usage of each one of the Lucene index files (only applies if segment stats are requested).")
boolean IncludeSegmentFileSizes

@documentation("If set to true segment stats will include stats for segments that are not currently loaded into memory.")
boolean IncludeUnloadedSegments

@documentation("Indicates whether unmapped fields should be included in the response.")
boolean IncludeUnmapped

@documentation("Return 'YES' decisions in explanation.")
boolean IncludeYesDecisions

@documentation("If set to true the rollover action will only be validated but not actually performed even if a condition matches.")
boolean IndicesRolloverDryRun

@documentation("Specify whether format-based query failures (such as providing text to a numeric field) should be ignored.")
boolean Lenient

@documentation("Return local information, do not retrieve the state from cluster-manager node.")
boolean Local

@documentation("Specifies if term offsets should be returned.")
boolean Offsets

@documentation("If true, only ancient (an older Lucene major release) segments will be upgraded.")
boolean OnlyAncientSegments

@documentation("Specify whether the operation should only expunge deleted documents.")
boolean OnlyExpungeDeletes

@documentation("Specifies if term payloads should be returned.")
boolean Payloads

@documentation("Specifies if term positions should be returned.")
boolean Positions

@documentation("Whether to update existing settings. If set to `true` existing settings on an index remain unchanged.")
boolean PreserveExisting

@documentation("Set to true to return stats only for primary shards.")
boolean Pri

@documentation("Specify whether the operation should only perform on primary shards. Defaults to false.")
boolean PrimaryOnly

@documentation("Specify whether to profile the query execution.")
boolean Profile

@documentation("Clear query caches.")
boolean Query

@documentation("Specify whether to perform the operation in realtime or search mode.")
boolean Realtime

boolean RefreshBoolean

@documentation("Clear request cache.")
boolean Request

@documentation("Specify if request cache should be used for this request or not, defaults to index level setting.")
boolean RequestCache

@documentation("When true, requires destination to be an alias.")
boolean RequireAlias

@documentation("Indicates whether hits.total should be rendered as an integer or an object in the rest search response.")
boolean RestTotalHitsAsInt

@documentation("Retries allocation of shards that are blocked due to too many subsequent allocation failures.")
boolean RetryFailed

@documentation("Provide a more detailed explanation showing the actual Lucene query that will be executed.")
boolean Rewrite

@documentation("Specify whether to return sequence number and primary term of the last modification of each hit.")
boolean SeqNoPrimaryTerm

@documentation("Specifies if total term frequency and document frequency should be returned.")
boolean TermStatistics

@documentation("Whether to calculate and return scores even if they are not used for sorting.")
boolean TrackScores

@documentation("Indicate if the number of documents that match the query should be tracked.")
boolean TrackTotalHits

@documentation("Set to false to disable timestamping.")
boolean Ts

@documentation("Specify whether aggregation and suggester names should be prefixed by their respective types in the response.")
boolean TypedKeys

@documentation("Verbose mode. Display column headers.")
boolean V

boolean Verbose

@documentation("Whether to verify the repository after creation.")
boolean Verify

@documentation("Should this request wait until the operation has completed before returning.")
boolean WaitForCompletionFalse

@documentation("Should this request wait until the operation has completed before returning.")
boolean WaitForCompletionTrue

@documentation("Whether to wait until there are no initializing shards in the cluster.")
boolean WaitForNoInitializingShards

@documentation("Whether to wait until there are no relocating shards in the cluster.")
boolean WaitForNoRelocatingShards

@documentation("Specifies whether to wait for all excluded nodes to be removed from the cluster before clearing the voting configuration exclusions list.")
boolean WaitForRemoval

@documentation("If set to true the flush operation will block until the flush can be executed if another flush operation is already executing. If set to false the flush will be skipped iff if another flush operation is already running.")
boolean WaitIfOngoing

@documentation("Whether to return document version as part of a hit.")
boolean WithVersion

@documentation("When true, applies mappings only to the write index of an alias or data stream.")
boolean WriteIndexOnly
