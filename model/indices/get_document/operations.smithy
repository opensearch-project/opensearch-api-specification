// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

@externalDocumentation(
    "OpenSearch Documentation": "https://opensearch.org/docs/latest/opensearch/rest-api/document-apis/get-documents/"
)

@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_doc/{id}")
@documentation("The Get document API operation allows to search for document with index [_doc]")
operation GetDocumentDoc {
    input: GetDocumentDocInput,
    output: GetDocumentDocOutput
}


@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/{index}/_source/{id}")
@documentation("The Get document API operation allows to search for document with index [_source]")
operation GetDocumentSource {
    input: GetDocumentSourceInput,
    output: GetDocumentSourceOutput
}