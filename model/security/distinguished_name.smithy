// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure CreateDistinguishedNameParams{
    nodes_dn: DistinguishedNamesDetails
}

list DistinguishedNamesDetails{
    member: String
}

structure DistinguishedName{
    nodes_dn: DistinguishedNamesDetails
}

list DistinguishedNamesList{
    member: DistinguishedName
}
