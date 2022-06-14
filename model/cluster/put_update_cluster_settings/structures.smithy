// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

structure PutUpdateClusterSettingsInput {
    
    @httpQuery("flat_settings")
    flat_settings: Boolean,

    @httpQuery("master_timeout")
    master_timeout: Time,

    @httpQuery("timeout")
    timeout: Time,

    // Request-body parameters 
    persistent: UserDefinedValueMap,

    transient: UserDefinedValueMap

}


structure PutUpdateClusterSettingsOutput {

    acknowledged: Boolean,
    
    persistent: UserDefinedValueMap,

    transient: UserDefinedValueMap
    
}
