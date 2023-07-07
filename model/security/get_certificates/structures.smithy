// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure GetCertificates_Input {}

@output
structure GetCertificates_Output {
    http_certificates_list: CertificatesList,
    transport_certificates_list: CertificatesList
}
