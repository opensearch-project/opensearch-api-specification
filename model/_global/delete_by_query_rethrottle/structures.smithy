// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure DeleteByQueryRethrottle_QueryParams {
    @httpQuery("requests_per_second")
    @required
    requests_per_second: RequestsPerSecond,
}


@input
structure DeleteByQueryRethrottle_Input with [DeleteByQueryRethrottle_QueryParams] {
    @required
    @httpLabel
    @documentation("The task id to rethrottle.")
    task_id: PathTaskId,
}

// TODO: Fill in Output Structure
structure DeleteByQueryRethrottle_Output {}
