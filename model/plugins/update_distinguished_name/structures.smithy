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

@input
structure CreateDistinguishedName_Input {
    @required
    @httpLabel
    cluster_name: String
    @httpPayload
    content: CreateDistinguishedNameParams
}

@output
structure CreateDistinguishedName_Output {
    status: MessageStatus,
    message: Message
}
