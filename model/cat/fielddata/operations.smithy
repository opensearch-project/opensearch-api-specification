// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch
use opensearch.openapi#vendorExtensions

@externalDocumentation(
    "API Reference": "https://opensearch.org/docs/latest/api-reference/cat/cat-field-data/"
)

@vendorExtensions(
    "x-operation-group": "cat.fielddata",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/fielddata")
@documentation("Shows how much heap memory is currently being used by fielddata on every data node in the cluster.")
operation CatFielddata {
    input: CatFielddata_Input,
    output: CatFielddata_Output
}

@vendorExtensions(
    "x-operation-group": "cat.fielddata",
    "x-version-added": "1.0",
)
@readonly
@suppress(["HttpUriConflict"])
@http(method: "GET", uri: "/_cat/fielddata/{fields}")
@documentation("Shows how much heap memory is currently being used by fielddata on every data node in the cluster.")
operation CatFielddata_WithFields {
    input: CatFielddata_WithFields_Input,
    output: CatFielddata_Output
}
