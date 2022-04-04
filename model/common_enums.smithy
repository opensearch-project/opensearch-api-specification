// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

@enum([
    {
     value: "all",
     name: "all",
     documentation:"Match any data stream or index, including hidden ones."},
    {
     value: "open",
     name: "open",
     documentation:"Match open, non-hidden indices. Also matches any non-hidden data stream."},
    {
     value: "closed",
     name: "closed",
     documentation:"Match closed, non-hidden indices. Also matches any non-hidden data stream. Data streams cannot be closed."},
    {
     value: "hidden",
     name: "hidden",
     documentation:"Match hidden data streams and hidden indices. Must be combined with open, closed, or both."},
    {
     value: "none",
     name: "none",
     documentation:"Wildcard expressions are not accepted."}
])
string ExpandWildcards

@enum([
    {
     value: "AND",
     name: "AND"},
    {
     value: "OR",
     name: "OR"}
])
string DefaultOperator

@enum([
    {
     value: "0",
     name: "query_then_fetch",
     documentation:"Documents are scored using local term and document frequencies for the shard. This is usually faster but less accurate."},
    {
     value: "1",
     name: "dfs_query_then_fetch",
     documentation:"Documents are scored using global term and document frequencies across all shards. This is usually slower but more accurate."}
])
string SearchType

@enum([
    {
     value: "0",
     name: "missing"},
    {
     value: "1",
     name: "popular"},
    {
     value: "2",
     name: "always"}
])
string SuggestMode

@enum([
    {
     value: "internal",
     name: "internal"},
     {
     value: "external",
     name: "external"},
    {
     value: "external_gte",
     name: "external_gte"}
])
string VersionType

@enum([
    {
     value: "green",
     name: "green"},
     {
     value: "yellow",
     name: "yellow"},
    {
     value: "red",
     name: "red"}
])
string HealthStatus

@enum([
    {
     value: "eq",
     name: "eq",
     documentation:"Accurate"},
     {
     value: "gte",
     name: "gte",
     documentation:"Lower bound, including returned documents"}
])
string Relation
