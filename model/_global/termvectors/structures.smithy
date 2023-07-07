// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure Termvectors_QueryParams {
    @httpQuery("term_statistics")
    @default(false)
    term_statistics: TermStatistics,

    @httpQuery("field_statistics")
    @default(true)
    field_statistics: FieldStatistics,

    @httpQuery("fields")
    @documentation("Comma-separated list of fields to return.")
    fields: Fields,

    @httpQuery("offsets")
    @default(true)
    offsets: Offsets,

    @httpQuery("positions")
    @default(true)
    positions: Positions,

    @httpQuery("payloads")
    @default(true)
    payloads: Payloads,

    @httpQuery("preference")
    @default("random")
    preference: Preference,

    @httpQuery("routing")
    routing: Routing,

    @httpQuery("realtime")
    @documentation("Specifies if request is real-time as opposed to near-real-time.")
    @default(true)
    realtime: Realtime,

    @httpQuery("version")
    version: Version,

    @httpQuery("version_type")
    version_type: VersionType,
}

// TODO: Fill in Body Parameters
@documentation("Define parameters and or supply a document to get termvectors for. See documentation.")
structure Termvectors_BodyParams {}

@input
structure Termvectors_Get_Input with [Termvectors_QueryParams] {
    @required
    @httpLabel
    @documentation("The index in which the document resides.")
    index: PathIndex,
}

@input
structure Termvectors_Post_Input with [Termvectors_QueryParams] {
    @required
    @httpLabel
    @documentation("The index in which the document resides.")
    index: PathIndex,
    @httpPayload
    content: Termvectors_BodyParams,
}

@input
structure Termvectors_Get_WithId_Input with [Termvectors_QueryParams] {
    @required
    @httpLabel
    @documentation("The index in which the document resides.")
    index: PathIndex,

    @required
    @httpLabel
    @documentation("Document ID. When not specified a doc param should be supplied.")
    id: PathDocumentId,
}

@input
structure Termvectors_Post_WithId_Input with [Termvectors_QueryParams] {
    @required
    @httpLabel
    @documentation("The index in which the document resides.")
    index: PathIndex,

    @required
    @httpLabel
    @documentation("Document ID. When not specified a doc param should be supplied.")
    id: PathDocumentId,
    @httpPayload
    content: Termvectors_BodyParams,
}

// TODO: Fill in Output Structure
structure Termvectors_Output {}
