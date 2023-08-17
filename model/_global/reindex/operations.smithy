// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch


@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/im-plugin/reindex-data/"
)

@xOperationGroup("reindex")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_reindex")
@documentation("Allows to copy documents from one index to another, optionally filtering the source
documents by a query, changing the destination index settings, or fetching the
documents from a remote cluster.")
operation Reindex {
    input: Reindex_Input,
    output: Reindex_Output
}
