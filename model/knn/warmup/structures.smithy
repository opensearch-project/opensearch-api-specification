// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

@input
structure KNNWarmup_Input {
    @required
    @httpLabel
    index: PathIndices,
}

// TODO: Fill in Output Structure
structure KNNWarmup_Output{}
