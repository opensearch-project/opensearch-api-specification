/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type Evaluation, Result } from './types/eval.types'

export function overall_result(evaluations: Evaluation[]): Result {
  if (evaluations.length == 0) return Result.PASSED
  if (evaluations.some(e => e.result === Result.ERROR)) return Result.ERROR
  if (evaluations.some(e => e.result === Result.FAILED)) return Result.FAILED
  if (evaluations.every(e => e.result === Result.SKIPPED)) return Result.SKIPPED
  return Result.PASSED
}
