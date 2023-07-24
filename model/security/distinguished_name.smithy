// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure DistinguishedNames {
    nodes_dn: NodesDn
}
list NodesDn {
    member: String
}
map DistinguishedNamesMap {
    key: String,
    value: DistinguishedNames
}
