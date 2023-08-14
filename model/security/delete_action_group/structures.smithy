//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure DeleteActionGroup_Input{
    @required
    @httpLabel
    @documentation("Action group to delete.")
    action_group: String
}

@output
structure DeleteActionGroup_Output {
    status: SecurityOperationStatus,
    message: SecurityOperationMessage
}
