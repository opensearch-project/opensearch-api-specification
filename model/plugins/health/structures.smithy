// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure HealthResponse{
    message: String
    mode: String
    status: String
}

@input
structure HealthCheck_Input {
}

structure HealthCheck_Output {
    content: HealthResponse
}
