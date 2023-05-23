// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ScriptsPainlessExecute_QueryParams {
}

// TODO: Fill in Body Parameters
structure ScriptsPainlessExecute_BodyParams {}

@input
structure ScriptsPainlessExecute_Get_Input with [ScriptsPainlessExecute_QueryParams] {
}

@input
structure ScriptsPainlessExecute_Post_Input with [ScriptsPainlessExecute_QueryParams] {
    @httpPayload
    content: ScriptsPainlessExecute_BodyParams,
}

// TODO: Fill in Output Structure
structure ScriptsPainlessExecute_Output {}
