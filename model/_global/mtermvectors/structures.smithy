// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Mtermvectors_QueryParams {
    @httpQuery("ids")
    ids: Ids,

    @httpQuery("term_statistics")
    @documentation("Specifies if total term frequency and document frequency should be returned. Applies to all returned documents unless otherwise specified in body 'params' or 'docs'.")
    @default(false)
    term_statistics: TermStatistics,

    @httpQuery("field_statistics")
    @documentation("Specifies if document count, sum of document frequencies and sum of total term frequencies should be returned. Applies to all returned documents unless otherwise specified in body 'params' or 'docs'.")
    @default(true)
    field_statistics: FieldStatistics,

    @httpQuery("fields")
    @documentation("Comma-separated list of fields to return. Applies to all returned documents unless otherwise specified in body 'params' or 'docs'.")
    fields: Fields,

    @httpQuery("offsets")
    @documentation("Specifies if term offsets should be returned. Applies to all returned documents unless otherwise specified in body 'params' or 'docs'.")
    @default(true)
    offsets: Offsets,

    @httpQuery("positions")
    @documentation("Specifies if term positions should be returned. Applies to all returned documents unless otherwise specified in body 'params' or 'docs'.")
    @default(true)
    positions: Positions,

    @httpQuery("payloads")
    @documentation("Specifies if term payloads should be returned. Applies to all returned documents unless otherwise specified in body 'params' or 'docs'.")
    @default(true)
    payloads: Payloads,

    @httpQuery("preference")
    @documentation("Specify the node or shard the operation should be performed on. Applies to all returned documents unless otherwise specified in body 'params' or 'docs'.")
    @default("random")
    preference: Preference,

    @httpQuery("routing")
    @documentation("Routing value. Applies to all returned documents unless otherwise specified in body 'params' or 'docs'.")
    routing: Routing,

    @httpQuery("realtime")
    @documentation("Specifies if requests are real-time as opposed to near-real-time.")
    @default(true)
    realtime: Realtime,

    @httpQuery("version")
    version: Version,

    @httpQuery("version_type")
    version_type: VersionType,
}

// TODO: Fill in Body Parameters
structure Mtermvectors_BodyParams {}

@input
structure Mtermvectors_Get_Input with [Mtermvectors_QueryParams] {
}

@input
structure Mtermvectors_Post_Input with [Mtermvectors_QueryParams] {
    @httpPayload
    content: Mtermvectors_BodyParams,
}

@input
structure Mtermvectors_Get_WithIndex_Input with [Mtermvectors_QueryParams] {
    @required
    @httpLabel
    @documentation("The index in which the document resides.")
    index: PathIndex,
}

@input
structure Mtermvectors_Post_WithIndex_Input with [Mtermvectors_QueryParams] {
    @required
    @httpLabel
    @documentation("The index in which the document resides.")
    index: PathIndex,
    @httpPayload
    content: Mtermvectors_BodyParams,
}

// TODO: Fill in Output Structure
structure Mtermvectors_Output {}
