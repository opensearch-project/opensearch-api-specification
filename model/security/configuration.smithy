// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

structure DynamicConfig {
  dynamic: DynamicOptions
}

structure DynamicOptions {
  filteredAliasMode: String,
  disableRestAuth: Boolean,
  disableIntertransportAuth: Boolean,
  respectRequestIndicesOptions: Boolean,
  kibana: Document,
  http: Document,
  authc: Document,
  authz: Document,
  authFailureListeners: Document,
  doNotFailOnForbidden: Boolean,
  multiRolespanEnabled: Boolean,
  hostsResolverMode: String,
  doNotFailOnForbiddenEmpty: Boolean
}
