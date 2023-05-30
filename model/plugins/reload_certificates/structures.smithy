//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure ReloadHttpCertificates_Input {}

@output
structure ReloadHttpCertificates_Output {
    message: Message
}

@input
structure ReloadTransportCertificates_Input {}

@output
structure ReloadTransportCertificates_Output {
    message: Message
}
