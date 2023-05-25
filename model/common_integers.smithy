// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@documentation("The number of shard results that should be reduced at once on the coordinating node. This value should be used as a protection mechanism to reduce the memory overhead per search request if the potential number of shards in the request can be large.")
integer BatchedReduceSize

@documentation("Starting offset.")
integer From

@documentation("only perform the operation if the last operation that has changed the document has the specified primary term.")
integer IfPrimaryTerm

@documentation("only perform the operation if the last operation that has changed the document has the specified sequence number.")
integer IfSeqNo

@documentation("Controls the maximum number of concurrent searches the multi search api will execute.")
integer MaxConcurrentSearches

integer MaxConcurrentShardRequests

@documentation("Maximum number of documents to process (default: all documents).")
integer MaxDocs

@documentation("The number of segments the index should be merged into (default: dynamic).")
integer MaxNumSegments

@documentation("Include only documents with a specific `_score` value in the result.")
integer MinScore

@documentation("The order for this template when merging multiple matching ones (higher numbers are merged later, overriding the lower numbers).")
integer Order

@documentation("Threshold that enforces a pre-filter round-trip to prefilter search shards based on query rewriting if the number of shards the search request expands to exceeds the threshold. This filter round-trip can limit the number of shards significantly if for instance a shard can not match any documents based on its rewrite method ie. if date filters are mandatory to match but the shard bounds and the query are disjoint.")
integer PreFilterShardSize

@documentation("The throttle for this request in sub-requests per second. -1 means no throttle.")
integer RequestsPerSecond

@documentation("Specify how many times should the operation be retried when a conflict occurs.")
integer RetryOnConflict

@documentation("Size on the scroll request powering the operation.")
integer ScrollSize

integer Size

@documentation("Number of samples of thread stacktrace.")
integer SnapshotsCount

@documentation("How many suggestions to return in response.")
integer SuggestSize

@documentation("The maximum number of documents to collect for each shard, upon reaching which the query execution will terminate early.")
integer TerminateAfter

@documentation("Specify the number of threads to provide information for.")
integer Threads

@documentation("Explicit version number for concurrency control.")
integer Version

@documentation("Wait for the metadata version to be equal or greater than the specified metadata version.")
integer WaitForMetadataVersion

@documentation("The shard number.")
integer ShardNumber

@documentation("The generation number of the segment.")
integer GenerationNumber

@documentation("The number of documents in the segment.")
integer DocsCount

@documentation("The number of deleted documents in the segment.")
integer DocsDeleted