// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterPutDecommissionAwareness_QueryParams {
}

// TODO: Fill in Body Parameters
structure ClusterPutDecommissionAwareness_BodyParams {}

@input
structure ClusterPutDecommissionAwareness_Input with [ClusterPutDecommissionAwareness_QueryParams] {
    @required
    @httpLabel
    awareness_attribute_name: PathAwarenessAttributeName,

    @required
    @httpLabel
    awareness_attribute_value: PathAwarenessAttributeValue,
    @httpPayload
    content: ClusterPutDecommissionAwareness_BodyParams,
}

// TODO: Fill in Output Structure
structure ClusterPutDecommissionAwareness_Output {}
