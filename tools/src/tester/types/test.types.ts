/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Operation } from "./eval.types"

export interface SpecTestCoverage {
  summary: {
    total_operations_count: number
    evaluated_operations_count: number
    evaluated_paths_pct: number
  },
  operations: Operation[]
  evaluated_operations: Operation[]
}
