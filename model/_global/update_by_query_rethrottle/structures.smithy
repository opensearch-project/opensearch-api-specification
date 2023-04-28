// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure UpdateByQueryRethrottle_QueryParams {
    @httpQuery("requests_per_second")
    @required
    requests_per_second: RequestsPerSecond,
}

// TODO: Fill in Body Parameters
structure UpdateByQueryRethrottle_BodyParams {}

@input
structure UpdateByQueryRethrottle_Input with [UpdateByQueryRethrottle_QueryParams] {
    @required
    @httpLabel
    @documentation("The task id to rethrottle.")
    task_id: PathTaskId,
    @httpPayload
    content: UpdateByQueryRethrottle_BodyParams,
}

// TODO: Fill in Output Structure
structure UpdateByQueryRethrottle_Output {}
