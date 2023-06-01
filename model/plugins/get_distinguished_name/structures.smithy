// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

list DistinguishedNamesDetails{
    member: String
}

structure DistinguishedName{
    nodes_dn: DistinguishedNamesDetails
}

list DistinguishedNamesList{
    member:DistinguishedName
}

@input
structure GetDistinguishedNames_Input {}

@output
structure GetDistinguishedNames_Output {
    content: DistinguishedNamesList
}

@input
structure GetDistinguishedName_Input{
    @required
    @httpLabel
    cluster_name: String
}

@output
structure GetDistinguishedName_Output {
    content: DistinguishedName
}
