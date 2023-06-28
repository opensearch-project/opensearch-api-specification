// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure IngestSimulate_QueryParams {
    @httpQuery("verbose")
    @documentation("Verbose mode. Display data output for each processor in executed pipeline.")
    @default(false)
    verbose: Verbose,
}

// TODO: Fill in Body Parameters
@documentation("The simulate definition")
structure IngestSimulate_BodyParams {}

@input
structure IngestSimulate_Get_Input with [IngestSimulate_QueryParams] {
}

@input
structure IngestSimulate_Post_Input with [IngestSimulate_QueryParams] {
    @required
    @httpPayload
    content: IngestSimulate_BodyParams,
}

@input
structure IngestSimulate_Get_WithId_Input with [IngestSimulate_QueryParams] {
    @required
    @httpLabel
    id: PathPipelineId,
}

@input
structure IngestSimulate_Post_WithId_Input with [IngestSimulate_QueryParams] {
    @required
    @httpLabel
    id: PathPipelineId,
    @required
    @httpPayload
    content: IngestSimulate_BodyParams,
}

// TODO: Fill in Output Structure
structure IngestSimulate_Output {}
