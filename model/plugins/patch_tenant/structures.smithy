// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure PatchTenantParams{
    tenantPatch: PatchOperation
}

@input
structure PatchTenant_Input {
    @required
    @httpLabel
    tenant: String

    @httpPayload
    content: PatchTenantParams
}

@output
structure PatchTenant_Output {
    status: MessageStatus,
    message: Message
}

structure PatchTenantsParams{
    tenantsPatch: PatchOperationList
}

@input
structure PatchTenants_Input{
    content: PatchTenantsParams
}

@output
structure PatchTenants_Output {
    status: MessageStatus,
    message: Message
}
