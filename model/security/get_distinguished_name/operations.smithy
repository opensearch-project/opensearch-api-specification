// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/security/access-control/api/#get-distinguished-names"
)

@vendorExtensions(
    "x-operation-group": "security.get_distinguished_names",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict", "HttpMethodSemantics.UnexpectedPayload"])
@http(method: "GET", uri: "/_plugins/_security/api/nodesdn/{cluster_name}")
@documentation("Retrieve distinguished names of a specified cluster.")
operation GetDistinguishedNamesWithClusterName {
    input: GetDistinguishedNamesWithClusterName_Input,
    output: GetDistinguishedNamesWithClusterName_Output
}
