// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/document-apis/bulk/"
)

@xOperationGroup("bulk")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/_bulk")
@documentation("Allows to perform multiple index/update/delete operations in a single request.")
operation Bulk_Post {
    input: Bulk_Post_Input,
    output: Bulk_Output
}

@xOperationGroup("bulk")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/_bulk")
@documentation("Allows to perform multiple index/update/delete operations in a single request.")
operation Bulk_Put {
    input: Bulk_Put_Input,
    output: Bulk_Output
}

@xOperationGroup("bulk")
@xVersionAdded("1.0")
@suppress(["HttpUriConflict"])
@http(method: "POST", uri: "/{index}/_bulk")
@documentation("Allows to perform multiple index/update/delete operations in a single request.")
operation Bulk_Post_WithIndex {
    input: Bulk_Post_WithIndex_Input,
    output: Bulk_Output
}

@xOperationGroup("bulk")
@xVersionAdded("1.0")
@idempotent
@suppress(["HttpUriConflict"])
@http(method: "PUT", uri: "/{index}/_bulk")
@documentation("Allows to perform multiple index/update/delete operations in a single request.")
operation Bulk_Put_WithIndex {
    input: Bulk_Put_WithIndex_Input,
    output: Bulk_Output
}
