// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Info_QueryParams {
}


@input
structure Info_Input with [Info_QueryParams] {
}

@output
structure Info_Output {
    name: String,
    cluster_name: String,
    cluster_uuid: String,
    version: InfoVersion,
    tagline: String
}

structure InfoVersion {
    distribution: String,
    number: String,
    build_type: String,
    build_hash: String,
    build_date: String,
    build_snapshot: Boolean,
    lucene_version: String,
    minimum_wire_compatibility_version: String,
    minimum_index_compatibility_version: String
}
