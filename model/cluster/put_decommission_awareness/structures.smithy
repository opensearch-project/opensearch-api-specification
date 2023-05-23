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


@input
structure ClusterPutDecommissionAwareness_Input with [ClusterPutDecommissionAwareness_QueryParams] {
    @required
    @httpLabel
    awareness_attribute_name: PathAwarenessAttributeName,

    @required
    @httpLabel
    awareness_attribute_value: PathAwarenessAttributeValue,
}

// TODO: Fill in Output Structure
structure ClusterPutDecommissionAwareness_Output {}
