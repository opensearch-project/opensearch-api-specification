// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@mixin
structure ClusterGetDecommissionAwareness_QueryParams {
}


@input
structure ClusterGetDecommissionAwareness_Input with [ClusterGetDecommissionAwareness_QueryParams] {
    @required
    @httpLabel
    awareness_attribute_name: PathAwarenessAttributeName,
}

// TODO: Fill in Output Structure
structure ClusterGetDecommissionAwareness_Output {}
