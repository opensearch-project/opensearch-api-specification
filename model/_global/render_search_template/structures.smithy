// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure RenderSearchTemplate_QueryParams {
}

// TODO: Fill in Body Parameters
structure RenderSearchTemplate_BodyParams {}

@input
structure RenderSearchTemplate_Get_Input with [RenderSearchTemplate_QueryParams] {
}

@input
structure RenderSearchTemplate_Post_Input with [RenderSearchTemplate_QueryParams] {
    @httpPayload
    content: RenderSearchTemplate_BodyParams,
}

@input
structure RenderSearchTemplate_Get_WithId_Input with [RenderSearchTemplate_QueryParams] {
    @required
    @httpLabel
    id: PathSearchTemplateId,
}

@input
structure RenderSearchTemplate_Post_WithId_Input with [RenderSearchTemplate_QueryParams] {
    @required
    @httpLabel
    id: PathSearchTemplateId,
    @httpPayload
    content: RenderSearchTemplate_BodyParams,
}

// TODO: Fill in Output Structure
structure RenderSearchTemplate_Output {}
