// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure Tenant {
    reserved: Boolean,
    hidden: Boolean,
    description: String,
    static: Boolean
}

map TenantsMap {
    key: String,
    value: Tenant
}
