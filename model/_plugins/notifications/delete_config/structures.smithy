//  SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure NotificationsConfigs_Delete_Input {
    @required
    @httpLabel
    target: String

}

// TODO: Fill in Output Structure (delete_response_list: object)
@output
structure NotificationsConfigs_Delete_Output {
}
