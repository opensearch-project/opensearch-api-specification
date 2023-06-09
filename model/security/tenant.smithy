// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

map AttributeMap {
    key: String,
    value: String
}

structure PatchOperation {
    op: String,
    path: String,
    value: AttributeMap
}

structure Tenant{
    reserved: Boolean,
    hidden: Boolean,
    description: String,
    static: Boolean
}
