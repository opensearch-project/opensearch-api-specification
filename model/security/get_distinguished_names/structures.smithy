// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure GetDistinguishedNames_Input {}

@input
structure GetDistinguishedNamesWithClusterName_Input{
    @required
    @httpLabel
    cluster_name: String
}

@output
structure GetDistinguishedNames_Output {
    @httpPayload
    content: DistinguishedNamesMap
}

@output
structure GetDistinguishedNamesWithClusterName_Output {
    @httpPayload
    content: DistinguishedNamesMap
}
