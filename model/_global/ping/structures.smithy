// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

structure GetPingClusterInput {

}

structure GetPingClusterOutput {

  name: String,

  cluster_name: String,

  cluster_uuid: String,

  version: intermediateStructure,

  tagline: String
      
}

structure intermediateStructure{

  distribution: String,

  number: String,

  build_type: String,

  build_hash: String,

  build_date: String,

  build_snapshot: Boolean,

  lucene_version: String,

  minimum_wire_compatibility_version: String,

  minimum_index_compatibility_version: String

}
