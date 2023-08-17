// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#get-distinguished-names"
)

@xOperationGroup("security.get_distinguished_names")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_plugins/_security/api/nodesdn")
@documentation("Retrieves all distinguished names in the allow list.")
operation GetDistinguishedNames {
    input: GetDistinguishedNames_Input,
    output: GetDistinguishedNames_Output
}

@xOperationGroup("security.get_distinguished_names")
@xVersionAdded("1.0")
@readonly
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "GET", uri: "/_plugins/_security/api/nodesdn/{cluster_name}")
@documentation("Retrieve distinguished names of a specified cluster.")
operation GetDistinguishedNamesWithClusterName {
    input: GetDistinguishedNamesWithClusterName_Input,
    output: GetDistinguishedNamesWithClusterName_Output
}
