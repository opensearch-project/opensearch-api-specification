// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterPutWeightedRouting_QueryParams {
}

// TODO: Fill in Body Parameters
structure ClusterPutWeightedRouting_BodyParams {}

@input
structure ClusterPutWeightedRouting_Input with [ClusterPutWeightedRouting_QueryParams] {
    @required
    @httpLabel
    attribute: PathAttribute,
    @httpPayload
    content: ClusterPutWeightedRouting_BodyParams,
}

// TODO: Fill in Output Structure
structure ClusterPutWeightedRouting_Output {}
