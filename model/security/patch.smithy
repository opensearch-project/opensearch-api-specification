// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

list PatchOperationList {
    member: PatchOperation
}

structure PatchOperation {
    @documentation("The operation to perform. Possible values: remove,add, replace, move, copy, test.")
    @required
    op: String,@documentation("The path to the resource.")
    @required
    path: String,@documentation("The new values used for the update.")
    value: Document
}
