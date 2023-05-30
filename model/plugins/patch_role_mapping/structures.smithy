// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch


@input
structure PatchRoleMapping_Input{
    @required
    @httpLabel
    role: String

    role_mapping_patch: PatchOperationList
}

@output
structure PatchRoleMapping_Output {
    content: RoleMappingResponse
}

@input
structure PatchRolesMapping_Input {
    role_patch: PatchOperationList
}

@output
structure PatchRolesMapping_Output {
    content: RoleMappingResponse
}
