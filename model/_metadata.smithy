// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"

metadata suppressions = [
    {
        id: "DeprecatedShape.OpenSearch#MasterTimeout",
        namespace: "OpenSearch",
        reason: "Deprecated for downstream use, not worried about warnings inside Smithy"
    },
    {
        id: "DeprecatedShape.OpenSearch#CatMaster",
        namespace: "OpenSearch",
        reason: "Deprecated for downstream use, not worried about warnings inside Smithy"
    },
    {
        id: "DeprecatedShape.OpenSearch#ClearScroll_WithScrollId",
        namespace: "OpenSearch",
        reason: "Deprecated for downstream use, not worried about warnings inside Smithy"
    },
    {
        id: "DeprecatedShape.OpenSearch#NodesHotThreads_Deprecated",
        namespace: "OpenSearch",
        reason: "Deprecated for downstream use, not worried about warnings inside Smithy"
    },
    {
        id: "DeprecatedShape.OpenSearch#NodesHotThreads_DeprecatedCluster",
        namespace: "OpenSearch",
        reason: "Deprecated for downstream use, not worried about warnings inside Smithy"
    },
    {
        id: "DeprecatedShape.OpenSearch#NodesHotThreads_DeprecatedDash",
        namespace: "OpenSearch",
        reason: "Deprecated for downstream use, not worried about warnings inside Smithy"
    },
    {
        id: "DeprecatedShape.OpenSearch#NodesHotThreads_WithNodeId_Deprecated",
        namespace: "OpenSearch",
        reason: "Deprecated for downstream use, not worried about warnings inside Smithy"
    },
    {
        id: "DeprecatedShape.OpenSearch#NodesHotThreads_WithNodeId_DeprecatedCluster",
        namespace: "OpenSearch",
        reason: "Deprecated for downstream use, not worried about warnings inside Smithy"
    },
    {
        id: "DeprecatedShape.OpenSearch#NodesHotThreads_WithNodeId_DeprecatedDash",
        namespace: "OpenSearch",
        reason: "Deprecated for downstream use, not worried about warnings inside Smithy"
    },
    {
        id: "DeprecatedShape.OpenSearch#PathScrollIds",
        namespace: "OpenSearch",
        reason: "Deprecated for downstream use, not worried about warnings inside Smithy"
    },
    {
        id: "DeprecatedShape.OpenSearch#Scroll_Get_WithScrollId",
        namespace: "OpenSearch",
        reason: "Deprecated for downstream use, not worried about warnings inside Smithy"
    },
    {
        id: "DeprecatedShape.OpenSearch#Scroll_Post_WithScrollId",
        namespace: "OpenSearch",
        reason: "Deprecated for downstream use, not worried about warnings inside Smithy"
    },
    {
        id: "ProtocolHttpPayload",
        namespace: "OpenSearch",
        reason: "AWS protocols validator rejects @httpPayload targeting lists or maps, however for our use cases the conversion to OpenAPI functions as expected."
    }
]
